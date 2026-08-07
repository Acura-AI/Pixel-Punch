import React from "react";
import { Zap, Sparkles } from "lucide-react";

export const ComicHeader: React.FC = () => {
  return (
    <header className="relative w-full mb-8">
      {/* Red Header Bar */}
      <div className="bg-[#E8332B] border-b-[6px] border-black text-white py-3 px-4 shadow-[0_6px_0_0_rgba(0,0,0,0.2)]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-2 font-comic text-xl">
            <span className="bg-[#FFD400] text-black px-2.5 py-0.5 comic-box-sm -rotate-3 inline-flex items-center gap-1 font-bold">
              <Zap className="w-5 h-5 fill-black" /> POW!
            </span>
            <span className="font-italic tracking-wider uppercase hidden sm:inline-block">
              CAPTAIN CRITIQUE IS IN THE BUILDING!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#00C853] text-black font-comic text-sm px-3 py-1 comic-box-sm rotate-1 font-bold">
              ISSUE #1 • SPECIAL EDITION
            </span>
            <span className="bg-[#1A56DB] text-white font-comic text-xl px-2.5 py-0.5 comic-box-sm rotate-2 inline-flex items-center gap-1">
              <Sparkles className="w-5 h-5" /> BAM!
            </span>
          </div>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="max-w-4xl mx-auto text-center px-4 mt-6">
        <div className="relative inline-block my-2">
          {/* Background starburst effect */}
          <div className="absolute -inset-4 bg-[#FFD400] comic-box opacity-90 -rotate-2 -z-10 bg-halftone-dense"></div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-luckiest tracking-wider text-[#E8332B] drop-shadow-[5px_5px_0px_#000000] uppercase select-none flex items-center justify-center gap-2">
            PIXEL
            <span className="bg-black text-[#FFD400] px-4 py-1 rotate-[-2deg] inline-block shadow-[4px_4px_0_0_#fff] border-4 border-black">
              PUNCH
            </span>
          </h1>
        </div>

        <p className="font-comic text-2xl sm:text-3xl text-black mt-3 tracking-wide uppercase font-bold">
          THE <span className="bg-[#FFD400] px-2 py-0.5 comic-box-sm inline-block -rotate-1">HONEST</span> LANDING PAGE CRITIC!
        </p>

        {/* Superhero Speech Bubble Intro */}
        <div className="mt-6 max-w-2xl mx-auto relative">
          <div className="speech-bubble p-4 sm:p-5 text-left bg-white">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8332B] border-4 border-black flex-shrink-0 flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#000]">
                🦸‍♂️
              </div>
              <div>
                <p className="font-comic text-lg text-[#E8332B] uppercase tracking-wider font-bold">
                  CAPTAIN CRITIQUE SAYS:
                </p>
                <p className="font-body text-base font-extrabold text-gray-900 leading-snug">
                  "I deliver honest superhero truths! Feed me a screenshot or URL — if your page is broken, I'll roast it; if it's heroic, I'll give it the glory it deserves!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

