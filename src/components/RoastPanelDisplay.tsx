import React, { useRef, useState, useEffect } from "react";
import { RoastResult } from "../types";
import { Flame, RefreshCw, Download, Copy, Check, Zap, Sparkles, ShieldCheck, Share2, Award } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";

interface RoastPanelDisplayProps {
  result: RoastResult;
  imagePreview?: string | null;
  onReset: () => void;
}

export const RoastPanelDisplay: React.FC<RoastPanelDisplayProps> = ({
  result,
  imagePreview,
  onReset,
}) => {
  const comicContainerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Fire celebratory comic confetti on reveal
  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E8332B", "#FFD400", "#1A56DB", "#00C853", "#000000"],
    });
  }, []);

  // Download comic strip as image
  const handleDownloadImage = async () => {
    if (!comicContainerRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(comicContainerRef.current, {
        cacheBust: true,
        backgroundColor: "#FFFDF5",
        quality: 0.95,
      });

      const link = document.createElement("a");
      link.download = `pixelpunch-roast-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 40,
        spread: 60,
        colors: ["#FFD400", "#E8332B", "#1A56DB"],
      });
    } catch (err) {
      console.error("Failed to export comic strip image:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy roast/review summary to clipboard
  const handleCopyText = () => {
    const isHighScore = result.powerScore >= 7;
    const textToCopy = `🦸‍♂️ CAPTAIN CRITIQUE'S LANDING PAGE REVIEW 🦸‍♂️
Alias: ${result.heroAlias}
Verdict: ${result.verdictTitle} (Score: ${result.powerScore}/10)

${isHighScore ? "🌟 THE HEROIC PRAISE:" : "🔥 THE ROAST:"}
${result.roasts.map((r, i) => `${i + 1}. ${r}`).join("\n")}

${isHighScore ? "✨ POLISH TWEAKS:" : "⚡ GAME PLAN FIXES:"}
${result.fixes.map((f, i) => `• ${f.title}: ${f.description}`).join("\n")}

Analyzed at PixelPunch — Comic Landing Page Critic!`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score <= 3) return "bg-[#E8332B] text-white"; // Red
    if (score <= 6) return "bg-[#FFD400] text-black"; // Yellow
    return "bg-[#00C853] text-black"; // Green
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-6 space-y-6">
      {/* Top Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 comic-box-sm">
        <button
          onClick={onReset}
          className="comic-btn bg-[#FFD400] text-black font-comic text-lg px-4 py-2 inline-flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5 stroke-[2.5]" /> ROAST ANOTHER PAGE
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyText}
            className="comic-btn bg-white text-black font-comic text-base px-4 py-2 inline-flex items-center gap-2 hover:bg-gray-100"
          >
            {copiedText ? (
              <>
                <Check className="w-5 h-5 text-green-600 stroke-[3]" /> COPIED!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 stroke-[2.5]" /> COPY ROAST TEXT
              </>
            )}
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="comic-btn bg-[#1A56DB] text-white font-comic text-base px-5 py-2 inline-flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            {isExporting ? "EXPORTING COMIC..." : "DOWNLOAD COMIC STRIP"}
          </button>
        </div>
      </div>

      {/* THE SHAREABLE COMIC STRIP CONTAINER (Target for html-to-image) */}
      <div
        ref={comicContainerRef}
        id="comic-strip-container"
        className="bg-[#FFFDF5] p-6 sm:p-8 comic-box-lg space-y-8 bg-halftone"
      >
        {/* Comic Strip Header / Issue Banner */}
        <div className="flex items-center justify-between border-b-4 border-black pb-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#E8332B] text-white font-luckiest text-2xl sm:text-3xl px-3 py-1 comic-box-sm -rotate-1">
              PIXELPUNCH
            </span>
            <span className="font-comic text-lg sm:text-xl text-black uppercase hidden sm:inline-block">
              SPECIAL EDITION ROAST
            </span>
          </div>

          <div className="text-right">
            <span className="bg-[#FFD400] text-black font-comic text-sm px-2.5 py-1 comic-box-sm uppercase inline-block">
              {result.analyzedUrl}
            </span>
            {result.analyzedAt && (
              <p className="font-body text-xs font-bold text-gray-700 mt-1">
                TIME: {result.analyzedAt}
              </p>
            )}
          </div>
        </div>

        {/* PANEL 1: THE CRITIC APPEARS & TARGET PREVIEW */}
        <div className="comic-box bg-white p-6 relative">
          <div className="absolute -top-4 left-4 bg-[#1A56DB] text-white font-comic text-lg px-3 py-0.5 comic-box-sm">
            PANEL 1: THE TARGET IDENTIFIED
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-2">
            {/* Screenshot Thumbnail */}
            {imagePreview && (
              <div className="md:col-span-5 relative">
                <div className="comic-box-sm overflow-hidden max-h-56 bg-black flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Target Landing Page Screenshot"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 -right-2 bg-[#FFD400] text-black font-comic text-xs px-2 py-0.5 comic-box-sm rotate-3">
                  EVIDENCE #A
                </div>
              </div>
            )}

            {/* Superhero Alias & Intro Speech */}
            <div className={`${imagePreview ? "md:col-span-7" : "md:col-span-12"} space-y-4`}>
              <div className="inline-block bg-[#E8332B] text-white font-comic text-sm px-3 py-1 comic-box-sm">
                TARGET HERO ALIAS:
              </div>
              <h2 className="text-4xl sm:text-5xl font-luckiest text-[#E8332B] uppercase tracking-wide drop-shadow-[2px_2px_0px_#000]">
                "{result.heroAlias}"
              </h2>

              <div className="speech-bubble p-4 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🦸‍♂️</span>
                  <p className="font-body font-extrabold text-black text-base leading-relaxed">
                    "I have inspected this landing page with my comic vision, hero! Here is my unfiltered superhero breakdown:"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: THE SAVAGE ROAST / HEROIC PRAISE (Comic Panel with Speech Callouts) */}
        <div className="comic-box bg-white p-6 relative bg-halftone-yellow">
          <div
            className={`absolute -top-4 left-4 ${
              result.powerScore >= 7 ? "bg-[#00C853] text-black" : "bg-[#E8332B] text-white"
            } font-comic text-lg px-3 py-0.5 comic-box-sm -rotate-1 font-bold`}
          >
            {result.powerScore >= 7
              ? "PANEL 2: THE HEROIC PRAISE 🌟"
              : "PANEL 2: THE SAVAGE ROAST 🔥"}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.roasts.map((item, index) => (
              <div
                key={index}
                className="speech-bubble p-4 bg-white flex items-start gap-3 hover:scale-[1.01] transition-transform"
              >
                <span
                  className={`${
                    result.powerScore >= 7 ? "bg-[#00C853] text-black" : "bg-[#E8332B] text-white"
                  } font-comic text-lg w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-black font-bold`}
                >
                  #{index + 1}
                </span>
                <p className="font-body font-black text-black text-base leading-snug">
                  "{item}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 3: THE VERDICT & CONVERSION POWER SCORE (Starburst Impact) */}
        <div className="comic-box bg-white p-6 relative">
          <div className="absolute -top-4 left-4 bg-[#00C853] text-black font-comic text-lg px-3 py-0.5 comic-box-sm rotate-1">
            PANEL 3: THE CONVERSION VERDICT
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Starburst Score Burst */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative select-none my-2">
                {/* Background Starburst Shape */}
                <div className="w-52 h-52 bg-[#FFD400] comic-box rounded-full flex flex-col items-center justify-center text-center p-4 bg-halftone-dense rotate-3 animate-comic-pulse">
                  <span className="font-comic text-sm text-black uppercase tracking-wider">
                    CONVERSION POWER
                  </span>
                  <span className="font-luckiest text-7xl text-[#E8332B] drop-shadow-[4px_4px_0px_#000]">
                    {result.powerScore}<span className="text-3xl text-black font-comic">/10</span>
                  </span>
                  <span className="font-comic text-xl bg-black text-white px-2 py-0.5 comic-box-sm -rotate-3 mt-1">
                    {result.comicSoundEffect || "KAPOW!"}
                  </span>
                </div>
              </div>
            </div>

            {/* Verdict Summary & Title */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="font-comic text-sm text-gray-600 uppercase">OFFICIAL VERDICT TITLE:</span>
                <h3 className="text-3xl sm:text-4xl font-luckiest text-black uppercase tracking-wide">
                  {result.verdictTitle}
                </h3>
              </div>

              {/* Power Level Meter Bar */}
              <div>
                <div className="flex justify-between items-center mb-1 font-comic text-sm">
                  <span>CONVERSION POTENTIAL:</span>
                  <span>{result.powerScore * 10}%</span>
                </div>
                <div className="w-full h-6 bg-gray-200 comic-box-sm overflow-hidden p-0.5">
                  <div
                    className={`h-full ${getScoreColor(result.powerScore)} comic-box-sm transition-all duration-500`}
                    style={{ width: `${Math.max(result.powerScore * 10, 8)}%` }}
                  ></div>
                </div>
              </div>

              <div className="speech-bubble p-4 bg-blue-50">
                <p className="font-body font-extrabold text-black text-base leading-snug">
                  "{result.verdictSummary}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 4: THE HERO FIX LIST / POLISH TWEAKS */}
        <div className="comic-box bg-white p-6 relative bg-halftone-blue">
          <div className="absolute -top-4 left-4 bg-[#FFD400] text-black font-comic text-lg px-3 py-0.5 comic-box-sm -rotate-1 font-bold">
            {result.powerScore >= 7
              ? "PANEL 4: THE POLISH LIST (FINE-TUNING PERFECTION) ✨"
              : "PANEL 4: THE HERO'S GAME PLAN (ACTIONS TO CONQUER) ⚡"}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.fixes.map((fix, idx) => (
              <div key={idx} className="comic-box-sm bg-white p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#FFD400] text-black font-comic text-sm rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                    ⚡
                  </div>
                  <h4 className="font-comic text-xl text-black uppercase tracking-wide">
                    {fix.title}
                  </h4>
                </div>
                <p className="font-body text-sm font-bold text-gray-800 leading-snug pl-9">
                  {fix.description}
                </p>
              </div>
            ))}
          </div>

          {result.heroQuote && (
            <div className="mt-6 pt-4 border-t-2 border-dashed border-white/60 text-center">
              <p className="font-comic text-xl text-yellow-300 uppercase tracking-widest drop-shadow-[2px_2px_0px_#000]">
                CAPTAIN CRITIQUE'S PARTING WORDS: "{result.heroQuote}"
              </p>
            </div>
          )}
        </div>

        {/* Footer Comic Watermark */}
        <div className="text-center pt-2 border-t-2 border-black">
          <p className="font-comic text-sm text-gray-700">
            PIXELPUNCH • POWERED BY GEMINI AI • SHARE YOUR ROAST ON TWITTER / SLACK!
          </p>
        </div>
      </div>
    </div>
  );
};
