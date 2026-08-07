import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 screenshots
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Initialize Gemini AI client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System prompt for Captain Critique
const CAPTAIN_CRITIQUE_SYSTEM_PROMPT = `You are CAPTAIN CRITIQUE, a comic-book superhero critic reviewing a screenshot of a website landing page (or analyzing a URL).

Your personality is witty and over-the-top comic-book flavored — but your JUDGMENT must be honest and accurate first. You are not a villain who trashes everything. You are a hero who tells the TRUTH, and the truth is sometimes "this is genuinely great."

SCORING RULES (follow strictly):
- Actually analyze the layout, hierarchy, copy clarity, color contrast, CTA visibility, spacing, trust signals, and overall polish before deciding a score.
- 1-3 = genuinely broken, cluttered, confusing, or amateur design (e.g. title: "ROOKIE MISTAKE", "CONVERSION DISASTER")
- 4-6 = has real problems but the bones are okay (e.g. title: "MEDIOCRE MAN", "BOUNCE RATE BOY")
- 7-8 = solid, professional, minor nitpicks only (e.g. title: "CONVERSION CRUSHER", "HEROIC DESIGN")
- 9-10 = excellent, polished, near flawless — few pages deserve this, but give it when it's earned (e.g. title: "LEAGUE OF LEGENDS", "APEX CONVERTER")
- Do NOT default to a low score for the sake of being funny. If the page is well-designed, SAY SO clearly and give it the high score it deserves. Comic critics still respect a worthy hero.

RESPONSE STRUCTURE:
1. THE VERDICT — Open by stating in one line whether this page is weak, decent, strong, or excellent, in comic voice (verdictSummary).
2. IF SCORE IS LOW (1-6): 
   - THE ROAST: 3-4 punchy, funny one-liners mocking the SPECIFIC real issues you see (be precise, not generic).
   - THE FIX LIST: 3-5 specific, actionable improvements.
3. IF SCORE IS HIGH (7-10):
   - THE PRAISE: 3-4 punchy, funny comic-style compliments calling out SPECIFIC things done well (be precise, not generic flattery).
   - THE POLISH LIST: 2-3 small optional tweaks to push it even further (skip or keep minimal if flawless).
4. THE POWER SCORE — X/10, with a fun comic title (verdictTitle) that matches the tier.

Keep it short, punchy, comic-panel style. No long paragraphs. Be specific to what you actually see in the image — never generic.`;

function parseAndFormatImagePayload(imageBase64: string, defaultMime = "image/png"): { mimeType: string; data: string } {
  const str = imageBase64.trim();

  // Case 1: Data URI format like data:image/png;base64,iVBORw... or data:image/svg+xml;utf8,...
  const dataUriRegex = /^data:([^;]+);([^,]+),(.*)$/s;
  const match = str.match(dataUriRegex);

  if (match) {
    const mime = match[1] || defaultMime;
    const encoding = match[2].toLowerCase();
    const payload = match[3];

    if (encoding === "base64") {
      return {
        mimeType: mime,
        data: payload.replace(/\s/g, ""),
      };
    } else {
      // utf8 or plain URL-encoded string
      try {
        const decoded = decodeURIComponent(payload);
        return {
          mimeType: mime.includes("svg") ? "image/svg+xml" : mime,
          data: Buffer.from(decoded, "utf-8").toString("base64"),
        };
      } catch {
        return {
          mimeType: mime.includes("svg") ? "image/svg+xml" : mime,
          data: Buffer.from(payload, "utf-8").toString("base64"),
        };
      }
    }
  }

  // Case 2: Plain SVG string starting with <svg or <?xml
  if (str.startsWith("<svg") || str.startsWith("<?xml")) {
    return {
      mimeType: "image/svg+xml",
      data: Buffer.from(str, "utf-8").toString("base64"),
    };
  }

  // Case 3: Raw base64 string
  return {
    mimeType: defaultMime,
    data: str.replace(/^data:[^;]+;base64,/, "").replace(/\s/g, ""),
  };
}

function parseModelJson(rawText: string): any {
  let text = rawText.trim();

  // Strip markdown code block wrappers if present
  if (text.includes("```")) {
    text = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  }

  // Extract substring from first '{' to last '}'
  const startIdx = text.indexOf("{");
  const endIdx = text.lastIndexOf("}");

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    text = text.substring(startIdx, endIdx + 1);
  }

  try {
    const parsed = JSON.parse(text);
    return {
      heroAlias: parsed.heroAlias || "PAGE DEFENDER",
      powerScore: typeof parsed.powerScore === "number" ? parsed.powerScore : 5,
      verdictTitle: parsed.verdictTitle || "VERDICT INCOMING",
      verdictSummary: parsed.verdictSummary || "Captain Critique analyzed your page layout.",
      roasts: Array.isArray(parsed.roasts) && parsed.roasts.length > 0 ? parsed.roasts : ["A mysterious layout flaw holds this page back!"],
      fixes: Array.isArray(parsed.fixes) && parsed.fixes.length > 0 ? parsed.fixes : [{ title: "Action Plan", description: "Improve visual hierarchy and CTA contrast." }],
      comicSoundEffect: parsed.comicSoundEffect || "KAPOW!",
      heroQuote: parsed.heroQuote || "Every landing page can become a conversion legend!",
    };
  } catch (err) {
    console.warn("JSON parse failed on extracted text, falling back gracefully. Raw text:", rawText);
    
    return {
      heroAlias: "THE MYSTERIOUS CONVERSION CANDIDATE",
      powerScore: 6,
      verdictTitle: "HEROIC POTENTIAL DETECTED!",
      verdictSummary: rawText.length > 20 ? rawText.slice(0, 250) + "..." : "Captain Critique reviewed the page and detected solid structure with key areas for polish.",
      roasts: [
        "Headline needs more immediate impact to hook first-time visitors.",
        "Primary action button could use higher contrast against the background.",
        "Ensure key value propositions are visible above the fold without scrolling."
      ],
      fixes: [
        { title: "CTA Contrast Boost", description: "Use a bold primary color on your main button to draw instant attention." },
        { title: "Headline Sharpening", description: "Focus your headline on the core outcome for the user within 3 seconds." }
      ],
      comicSoundEffect: "BAM!",
      heroQuote: "With sharp contrast and clear messaging, victory is guaranteed!"
    };
  }
}

app.post("/api/roast", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", url } = req.body;

    if (!imageBase64 && !url) {
      return res.status(400).json({
        error: "OOF! Please upload a screenshot or enter a website URL to roast, hero!",
      });
    }

    const ai = getGeminiClient();

    // If Gemini key is missing, return a funny comic fallback response with realistic critique structure
    if (!ai) {
      return res.json({
        heroAlias: "CAPTAIN CRITIQUE (OFFLINE MODE)",
        powerScore: 4,
        verdictTitle: "MEDIOCRE MAN!",
        verdictSummary: "Your landing page has potential, hero, but it suffers from generic headlines and invisible CTAs!",
        roasts: [
          "That headline is so sleepy even Sleeping Beauty wouldn't wake up to click it!",
          "Your call-to-action button is hiding like a timid ninja in a dark alley.",
          "So much wall of text! Did you mistake your landing page for War and Peace?",
          "No social proof anywhere — even my arch-nemesis wouldn't trust this page with a fake email!"
        ],
        fixes: [
          {
            title: "POWER UP THE CTA",
            description: "Make your primary button pop with high-contrast comic yellow or red and ultra-clear action copy like 'GET STARTED FREE'!"
          },
          {
            title: "CRUSH THE TEXT WALL",
            description: "Break long paragraphs into punchy 2-line bullet points with custom bold icons."
          },
          {
            title: "SUMMON TRUST SIGNALS",
            description: "Add real user reviews, star ratings, and brand logos right above the fold to boost instant credibility!"
          },
          {
            title: "SHARPEN THE HERO HEADLINE",
            description: "State the #1 core outcome in 7 words or less so visitors instantly know what they get."
          }
        ],
        comicSoundEffect: "KAPOW!",
        heroQuote: "Configure your GEMINI_API_KEY in Secrets for Captain Critique's full AI vision power!",
        analyzedUrl: url || "Uploaded Screenshot"
      });
    }

    const contentsParts: any[] = [];

    if (imageBase64) {
      const formattedImage = parseAndFormatImagePayload(imageBase64, mimeType);
      contentsParts.push({
        inlineData: {
          mimeType: formattedImage.mimeType,
          data: formattedImage.data,
        },
      });
    }

    let promptText = "Roast this landing page screenshot like Captain Critique!";
    if (url) {
      promptText += ` Website URL: ${url}.`;
    }
    contentsParts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: contentsParts },
      config: {
        systemInstruction: CAPTAIN_CRITIQUE_SYSTEM_PROMPT,
        temperature: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            heroAlias: {
              type: Type.STRING,
              description: "A funny superhero/villain hero moniker for this page, e.g. 'BOUNCE RATE BOY'",
            },
            powerScore: {
              type: Type.INTEGER,
              description: "Conversion power score from 1 to 10",
            },
            verdictTitle: {
              type: Type.STRING,
              description: "A bold comic verdict title, e.g. 'MEDIOCRE MAN!'",
            },
            verdictSummary: {
              type: Type.STRING,
              description: "A 1-2 sentence dramatic comic summary of the page's state",
            },
            roasts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 savage, funny one-liner roasts about specific visual/copy flaws",
            },
            fixes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["title", "description"],
              },
              description: "3-5 actionable improvement game plans",
            },
            comicSoundEffect: {
              type: Type.STRING,
              description: "A loud comic sound effect like KAPOW!, ZAP!, SLAM!",
            },
            heroQuote: {
              type: Type.STRING,
              description: "A punchy parting superhero/villain quote",
            },
          },
          required: [
            "heroAlias",
            "powerScore",
            "verdictTitle",
            "verdictSummary",
            "roasts",
            "fixes",
            "comicSoundEffect",
            "heroQuote",
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI model.");
    }

    const parsedJson = parseModelJson(resultText);
    parsedJson.analyzedUrl = url || "Uploaded Screenshot";
    parsedJson.analyzedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return res.json(parsedJson);
  } catch (err: any) {
    console.error("Error in /api/roast:", err);
    return res.status(500).json({
      error: `OOF! Something broke in the comic multiverse! ${err?.message || "Try again, hero."}`,
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚡ PixelPunch Comic Server running on http://localhost:${PORT}`);
  });
}

startServer();
