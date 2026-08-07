import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, Link as LinkIcon, Image as ImageIcon, Flame, X, Check, Sparkles } from "lucide-react";
import { PRESET_SAMPLES } from "../data/presetSamples";
import { PresetSample } from "../types";

interface UploadZoneProps {
  onRoastSubmit: (data: { imageBase64?: string; mimeType?: string; url?: string }) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onRoastSubmit, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [urlInput, setUrlInput] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setValidationError("OOF! Only image files (PNG, JPG, WebP) can be roasted!");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setValidationError("WHOA THERE! File is too heavy. Keep it under 15MB, hero!");
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
    setMimeType(file.type || "image/png");
    setSelectedPreset(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setSelectedPreset(preset.id);
    setImagePreview(preset.thumbnail);
    setMimeType("image/svg+xml");
    setUrlInput(preset.url);
    setSelectedFile(null);
    setValidationError(null);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setSelectedPreset(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!imagePreview && !urlInput.trim()) {
      setValidationError("A HERO NEEDS DATA! Upload a screenshot or paste a URL first!");
      return;
    }

    onRoastSubmit({
      imageBase64: imagePreview || undefined,
      mimeType,
      url: urlInput.trim() || undefined,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-6">
      <div className="comic-box-lg bg-white p-6 sm:p-8 bg-halftone relative">
        {/* Top panel tag */}
        <div className="absolute -top-5 left-6 bg-[#FFD400] text-black font-comic text-xl px-4 py-1 comic-box-sm uppercase tracking-wider">
          PANEL 1: THE TARGET SELECTION
        </div>

        <form onSubmit={handleSubmit} className="mt-2 space-y-6">
          {/* Validation Error Alert */}
          {validationError && (
            <div className="bg-[#E8332B] text-white p-3 comic-box-sm font-body font-bold flex items-center justify-between animate-bounce">
              <span className="font-comic text-lg">⚠️ {validationError}</span>
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="text-white hover:text-black font-bold text-xl px-2"
              >
                ×
              </button>
            </div>
          )}

          {/* Main Dropzone / Preview Area */}
          <div>
            <label className="block font-comic text-2xl text-black mb-2 uppercase tracking-wide">
              1. UPLOAD SCREENSHOT <span className="text-sm font-body text-gray-600 font-bold">(PNG, JPG, WEBP)</span>
            </label>

            {imagePreview ? (
              <div className="relative comic-box p-4 bg-gray-50 flex flex-col md:flex-row items-center gap-6">
                <div className="relative max-w-xs w-full h-48 comic-box-sm overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Landing Page Screenshot Preview"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-2 left-2 bg-[#1A56DB] text-white font-comic text-xs px-2 py-0.5 comic-box-sm">
                    TARGET READY
                  </div>
                </div>

                <div className="flex-1 space-y-3 text-left w-full">
                  <div className="inline-block bg-[#00C853] text-black font-comic text-sm px-3 py-1 comic-box-sm uppercase">
                    {selectedPreset ? "SAMPLE PRESET LOADED" : "CUSTOM SCREENSHOT LOADED"}
                  </div>
                  <p className="font-body font-extrabold text-lg text-black">
                    {selectedFile ? selectedFile.name : selectedPreset ? PRESET_SAMPLES.find(p => p.id === selectedPreset)?.name : "Screenshot Image"}
                  </p>
                  <p className="font-body text-sm text-gray-600">
                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • ${selectedFile.type}` : "Ready for Captain Critique's vision analysis!"}
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="comic-btn bg-[#E8332B] text-white font-comic text-sm px-4 py-1.5 inline-flex items-center gap-2 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" /> REMOVE & PICK ANOTHER
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`comic-box p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "bg-[#FFD400] scale-[1.01]"
                    : "bg-[#FFFDF5] hover:bg-[#FFF9DB]"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                
                <div className="w-16 h-16 mx-auto mb-4 bg-[#FFD400] text-black comic-box-sm flex items-center justify-center -rotate-3">
                  <Upload className="w-8 h-8 stroke-[2.5]" />
                </div>

                <p className="font-comic text-2xl text-black uppercase tracking-wide">
                  DRAG & DROP YOUR SCREENSHOT HERE
                </p>
                <p className="font-body font-bold text-gray-700 text-sm mt-1">
                  or <span className="text-[#1A56DB] underline">click to browse files</span> on your computer
                </p>
              </div>
            )}
          </div>

          {/* URL Input Field */}
          <div>
            <label className="block font-comic text-2xl text-black mb-2 uppercase tracking-wide">
              2. OR PASTE LANDING PAGE URL <span className="text-sm font-body text-gray-600 font-bold">(OPTIONAL EXTRA CONTEXT)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black">
                <LinkIcon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-awesome-landingpage.com"
                className="w-full pl-11 pr-4 py-3 font-body font-extrabold text-black bg-white comic-box-sm focus:outline-none focus:ring-2 focus:ring-[#FFD400] placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Presets Quick Picker */}
          <div>
            <p className="font-comic text-xl text-black mb-2 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 fill-[#FFD400]" /> OR TRY A SAMPLE LANDING PAGE:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_SAMPLES.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`comic-box-sm p-3 text-left transition-transform ${
                      isSelected
                        ? "bg-[#FFD400] scale-[1.02] ring-2 ring-black"
                        : "bg-white hover:bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-comic text-base text-black uppercase">
                        {preset.name}
                      </span>
                      <span className="bg-[#1A56DB] text-white font-comic text-[10px] px-1.5 py-0.5 comic-box-sm">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="font-body text-xs font-bold text-gray-700 line-clamp-1">
                      {preset.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Action Submit Button */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="comic-btn w-full sm:w-auto px-10 py-4 bg-[#E8332B] text-white font-luckiest text-3xl sm:text-4xl tracking-wider uppercase inline-flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
            >
              <Flame className="w-8 h-8 fill-yellow-400 text-yellow-400 animate-pulse" />
              <span>ROAST MY PAGE!</span>
              <span className="font-comic text-xl bg-[#FFD400] text-black px-2 py-0.5 comic-box-sm -rotate-6">
                KAPOW!
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
