import React, { useState } from "react";
import { PlaySquare, Search, Loader2, Sparkles, CheckCircle2, Video } from "lucide-react";

export default function VideoBar({
  videos,
  activeVideoId,
  onSelectVideo,
  onProcessVideo,
  isProcessing,
  processProgress,
  notification
}) {
  const [urlInput, setUrlInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim() || isProcessing) return;
    onProcessVideo(urlInput.trim());
  };

  return (
    <div className="bg-white border border-sage-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-600">
              <PlaySquare className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isProcessing}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-sage-300 bg-cream-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-600 text-sm text-forest-950 placeholder-sage-400 transition"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing || !urlInput.trim()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 disabled:bg-sage-300 text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cream-100" />
                <span>{processProgress || "Processing Video..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cream-200" />
                <span>Index Video</span>
              </>
            )}
          </button>
        </form>

        {/* Right: Quick Selector for Available / Demo Videos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 pt-1 border-t lg:border-t-0 border-sage-100">
          <span className="text-xs font-semibold text-sage-600 whitespace-nowrap flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-forest-600" />
            Active Video:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            {videos.map((vid) => {
              const isActive = vid.video_id === activeVideoId;
              return (
                <button
                  key={vid.video_id}
                  onClick={() => onSelectVideo(vid.video_id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 border whitespace-nowrap ${
                    isActive
                      ? "bg-forest-100 text-forest-900 border-forest-400 shadow-2xs"
                      : "bg-cream-100/80 hover:bg-cream-200 text-forest-800 border-sage-200"
                  }`}
                  title={vid.title}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-forest-600" : "bg-sage-400"}`} />
                  <span className="max-w-[160px] truncate font-sans">
                    {vid.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-forest-700 border border-sage-200 font-mono">
                    {vid.chunks_count} chunks
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ingestion Stepper Notification */}
      {isProcessing && (
        <div className="mt-4 pt-3 border-t border-sage-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-forest-800">
              <span className="w-2 h-2 rounded-full bg-forest-600 animate-ping" />
              <span>Pipeline Stage:</span>
            </div>
            <div className="flex-1 flex items-center gap-2 text-xs text-sage-700">
              <span className="bg-forest-50 px-2 py-0.5 rounded border border-forest-200 font-medium text-forest-800">
                {processProgress || "1. Extracting Transcripts → 2. Semantic Chunking → 3. Ollama BGE-M3 Vectorizing"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Notification banner */}
      {notification && (
        <div
          className={`mt-3 p-3 rounded-xl text-xs flex items-center justify-between gap-2 border ${
            notification.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-forest-50 text-forest-800 border-forest-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "error" ? (
              <span className="font-bold">Error:</span>
            ) : (
              <CheckCircle2 className="w-4 h-4 text-forest-600" />
            )}
            <span>{notification.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
