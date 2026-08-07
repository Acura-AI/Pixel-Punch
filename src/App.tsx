import React, { useState } from "react";
import { ComicHeader } from "./components/ComicHeader";
import { UploadZone } from "./components/UploadZone";
import { LoadingComicPanel } from "./components/LoadingComicPanel";
import { RoastPanelDisplay } from "./components/RoastPanelDisplay";
import { ComicFooter } from "./components/ComicFooter";
import { RoastResult, RoastRequest } from "./types";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function App() {
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoastSubmit = async (requestData: RoastRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRoastResult(null);

    if (requestData.imageBase64) {
      setImagePreview(requestData.imageBase64);
    } else {
      setImagePreview(null);
    }

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();
      let data: any = null;

      try {
        data = JSON.parse(responseText);
      } catch {
        if (!response.ok) {
          throw new Error(`Server status ${response.status}: ${responseText.slice(0, 120)}`);
        } else {
          throw new Error("Server returned non-JSON response.");
        }
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to generate roast.");
      }

      setRoastResult(data);
    } catch (err: any) {
      console.error("Roast submit error:", err);
      setErrorMessage(
        err?.message || "OOF! Something broke in the comic multiverse. Try again, hero!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRoastResult(null);
    setErrorMessage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-page-halftone text-black font-body flex flex-col justify-between selection:bg-[#FFD400] border-t-8 border-b-8 border-black">
      <div>
        <ComicHeader />

        <main>
          {/* Global Error Banner */}
          {errorMessage && (
            <div className="max-w-2xl mx-auto px-4 my-6">
              <div className="comic-box bg-[#E8332B] text-white p-6 relative bg-halftone">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FFD400] text-black comic-box-sm rounded-full flex items-center justify-center text-2xl flex-shrink-0 -rotate-6">
                    💥
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-comic text-2xl uppercase tracking-wider text-yellow-300">
                      OOF! SOMETHING BROKE!
                    </h3>
                    <p className="font-body font-extrabold text-base">
                      {errorMessage}
                    </p>
                    <button
                      onClick={handleReset}
                      className="comic-btn bg-[#FFD400] text-black font-comic text-base px-4 py-1.5 inline-flex items-center gap-2 mt-2"
                    >
                      <RefreshCw className="w-4 h-4 stroke-[2.5]" /> TRY AGAIN, HERO!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main State Views */}
          {isLoading && <LoadingComicPanel />}

          {!isLoading && !roastResult && (
            <UploadZone onRoastSubmit={handleRoastSubmit} isLoading={isLoading} />
          )}

          {!isLoading && roastResult && (
            <RoastPanelDisplay
              result={roastResult}
              imagePreview={imagePreview}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      <ComicFooter />
    </div>
  );
}

