import React, { useState, useEffect } from "react";
import { Zap, Flame, ShieldAlert } from "lucide-react";

const LOADING_CAPTIONS = [
  "Scanning hero headlines for sleeping buzzwords...",
  "Inspecting call-to-action buttons with superhero laser vision...",
  "Measuring contrast, cluttered blocks, and missing social proof...",
  "Calculating conversion power score in Captain Critique's comic matrix...",
  "Formulating savage comic one-liners and hero game plan...",
];

const SOUND_EFFECTS = ["POW!", "BAM!", "ZAP!", "KAPOW!", "SLAM!", "CRUNCH!"];

export const LoadingComicPanel: React.FC = () => {
  const [captionIndex, setCaptionIndex] = useState(0);
  const [soundIndex, setSoundIndex] = useState(0);

  useEffect(() => {
    const captionInterval = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % LOADING_CAPTIONS.length);
    }, 1800);

    const soundInterval = setInterval(() => {
      setSoundIndex((prev) => (prev + 1) % SOUND_EFFECTS.length);
    }, 800);

    return () => {
      clearInterval(captionInterval);
      clearInterval(soundInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 my-10">
      <div className="comic-box-lg bg-[#FFD400] p-8 text-center bg-halftone relative overflow-hidden">
        {/* Top Comic Tag */}
        <div className="inline-block bg-[#E8332B] text-white font-comic text-2xl px-5 py-1.5 comic-box-sm mb-6 -rotate-2">
          ⚡ PANELS IN PRODUCTION...
        </div>

        {/* Flashing Comic Starburst Center */}
        <div className="relative my-6 max-w-sm mx-auto flex items-center justify-center">
          <div className="w-56 h-56 bg-white comic-box rounded-full flex items-center justify-center relative animate-comic-pulse bg-halftone-dense">
            <div className="text-center p-4">
              <span className="font-luckiest text-5xl text-[#E8332B] drop-shadow-[3px_3px_0px_#000] block">
                {SOUND_EFFECTS[soundIndex]}
              </span>
              <span className="font-comic text-2xl text-black block mt-2">
                ANALYZING!
              </span>
            </div>
          </div>

          {/* Floating Sound Badges around central burst */}
          <div className="absolute -top-4 -left-4 bg-[#1A56DB] text-white font-comic text-lg px-3 py-1 comic-box-sm -rotate-12 animate-bounce">
            ZAP!
          </div>
          <div className="absolute -bottom-2 -right-4 bg-[#00C853] text-black font-comic text-lg px-3 py-1 comic-box-sm rotate-12 animate-bounce">
            SLAM!
          </div>
          <div className="absolute top-1/2 -left-8 -translate-y-1/2 bg-[#E8332B] text-white font-comic text-lg px-3 py-1 comic-box-sm -rotate-6">
            POW!
          </div>
        </div>

        {/* Captain Critique Speech Bubble Status */}
        <div className="speech-bubble max-w-xl mx-auto p-4 text-left mt-6 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8332B] border-2 border-black flex-shrink-0 flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
              🦸‍♂️
            </div>
            <div>
              <p className="font-comic text-base text-[#E8332B] uppercase">
                CAPTAIN CRITIQUE IS COMPUTING:
              </p>
              <p className="font-body font-extrabold text-base text-gray-900 animate-pulse">
                "{LOADING_CAPTIONS[captionIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar Comic Style */}
        <div className="w-full max-w-md mx-auto mt-6 bg-white comic-box-sm h-6 overflow-hidden relative">
          <div className="bg-[#E8332B] h-full w-full animate-pulse bg-halftone-dense"></div>
        </div>
      </div>
    </div>
  );
};
