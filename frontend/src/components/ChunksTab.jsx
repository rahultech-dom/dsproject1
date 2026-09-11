import React, { useState, useMemo } from "react";
import { Search, Play, Clock, Layers, Filter } from "lucide-react";

export default function ChunksTab({ chunks, onSeek, videoTitle }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChunks = useMemo(() => {
    if (!searchTerm.trim()) return chunks || [];
    const term = searchTerm.toLowerCase();
    return (chunks || []).filter((c) =>
      c.text.toLowerCase().includes(term) ||
      (c.start_formatted && c.start_formatted.includes(term))
    );
  }, [chunks, searchTerm]);

  return (
    <div className="bg-white border border-sage-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[650px]">
      {/* Search Header */}
      <div className="p-4 bg-cream-50/80 border-b border-sage-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-forest-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-forest-900">
              Semantic Transcript Explorer
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-sage-600 bg-white px-2 py-0.5 rounded-full border border-sage-200">
            {filteredChunks.length} / {chunks?.length || 0} chunks
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-sage-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search words, topics, or timestamps in transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-sage-300 bg-white text-xs text-forest-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-600 transition"
          />
        </div>
      </div>

      {/* Chunks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredChunks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-sage-500">
            <Filter className="w-8 h-8 opacity-40 mb-2" />
            <p className="text-xs">No chunks matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredChunks.map((chunk, idx) => (
            <div
              key={chunk.chunk_id ?? idx}
              className="p-3.5 rounded-xl bg-cream-50/60 hover:bg-cream-100 border border-sage-200 transition group flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSeek(chunk.start)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-800 font-mono text-xs font-semibold border border-forest-300 transition cursor-pointer"
                  title="Play video at this segment"
                >
                  <Play className="w-2.5 h-2.5 fill-forest-700 text-forest-700" />
                  <span>{chunk.start_formatted || `${Math.floor(chunk.start)}s`} - {chunk.end_formatted || `${Math.floor(chunk.end)}s`}</span>
                </button>
                <span className="text-[10px] font-mono text-sage-500">
                  Chunk #{chunk.chunk_id ?? idx + 1}
                </span>
              </div>
              <p className="text-xs text-forest-950 leading-relaxed font-sans">
                {chunk.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
