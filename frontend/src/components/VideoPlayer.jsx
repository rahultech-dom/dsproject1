import React, { useEffect, useRef } from "react";
import { Play, ExternalLink, Clock, Layers, Sparkles } from "lucide-react";

export default function VideoPlayer({
  videoId,
  videoTitle,
  chunksCount,
  seekSeconds,
  onGenerateSummary,
  onOpenChunks
}) {
  const iframeRef = useRef(null);

  // Construct iframe embed URL
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=${seekSeconds > 0 ? 1 : 0}&start=${Math.floor(seekSeconds || 0)}&enablejsapi=1`
    : "";

  return (
    <div className="bg-white border border-sage-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Video Embed Header */}
      <div className="px-4 py-3 bg-cream-50/80 border-b border-sage-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-900">
            Synchronized Player
          </span>
        </div>
        {seekSeconds > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-mono font-medium border border-forest-300">
            <Clock className="w-3 h-3 text-forest-600" />
            <span>Seek: {Math.floor(seekSeconds / 60)}:{(Math.floor(seekSeconds) % 60).toString().padStart(2, "0")}</span>
          </div>
        )}
      </div>

      {/* Embedded Iframe */}
      <div className="relative w-full pb-[56.25%] bg-forest-950 overflow-hidden">
        {videoId ? (
          <iframe
            key={`${videoId}-${seekSeconds}`}
            ref={iframeRef}
            src={embedUrl}
            title={videoTitle || "YouTube video player"}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-sage-300 p-6 text-center">
            <Play className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No video selected. Index a YouTube URL above.</p>
          </div>
        )}
      </div>

      {/* Video Details & Quick Controls */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-bold text-forest-950 leading-snug line-clamp-2">
            {videoTitle || "Video Intelligence Dashboard"}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-sage-600">
            <span className="flex items-center gap-1 font-mono">
              <Layers className="w-3.5 h-3.5 text-forest-600" />
              {chunksCount || 0} vectorized chunks
            </span>
            <span>•</span>
            <span className="text-forest-700 font-medium">BGE-M3 Embeddings</span>
            <span>•</span>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-forest-800 flex items-center gap-0.5 underline transition"
            >
              Watch on YouTube <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="pt-2 border-t border-sage-100 flex items-center gap-2 flex-wrap">
          <button
            onClick={onGenerateSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200 text-xs font-semibold transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>Generate Video Summary</span>
          </button>
          <button
            onClick={onOpenChunks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-forest-900 border border-cream-300 text-xs font-medium transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-sage-600" />
            <span>Explore All Chunks</span>
          </button>
        </div>
      </div>
    </div>
  );
}
