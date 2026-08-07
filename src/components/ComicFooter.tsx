import React from "react";
import { Zap, Heart, Flame } from "lucide-react";

export const ComicFooter: React.FC = () => {
  return (
    <footer className="w-full mt-12 mb-8 text-center px-4">
      <div className="max-w-4xl mx-auto comic-box bg-white p-6 bg-halftone">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-luckiest text-2xl text-[#E8332B] drop-shadow-[1.5px_1.5px_0px_#000]">
              PIXELPUNCH
            </span>
            <span className="bg-[#FFD400] text-black font-comic text-xs px-2 py-0.5 comic-box-sm -rotate-2">
              VOL #1
            </span>
          </div>

          <p className="font-body text-xs font-extrabold text-gray-800">
            Crafted for landing page heroes, founders & marketers worldwide! ⚡
          </p>

          <div className="flex items-center gap-2">
            <span className="bg-[#1A56DB] text-white font-comic text-xs px-2 py-0.5 comic-box-sm rotate-2">
              KAPOW!
            </span>
            <span className="bg-[#00C853] text-black font-comic text-xs px-2 py-0.5 comic-box-sm -rotate-2">
              BOOM!
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
