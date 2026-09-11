import React from "react";
import { X, Server, Layers, Cpu, Database, CheckCircle2, ArrowRight } from "lucide-react";

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-sage-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-cream-50 border-b border-sage-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest-700 text-white flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-forest-950">
                System Architecture & Data Pipeline
              </h3>
              <p className="text-xs text-sage-600">
                Local Multimodal RAG with Vector Search and Synchronized Playback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-sage-100 text-sage-600 hover:text-forest-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-forest-950">
          {/* Visual Pipeline Stepper */}
          <div className="bg-cream-50/80 p-4 rounded-2xl border border-sage-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">
              End-to-End Information Flow
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="p-3 bg-white rounded-xl border border-sage-200 text-center shadow-2xs">
                <div className="text-xs font-bold text-forest-800">1. Ingest</div>
                <div className="text-[11px] text-sage-600 mt-0.5">YouTube Transcript Extraction & Segmentation</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sage-200 text-center shadow-2xs">
                <div className="text-xs font-bold text-forest-800">2. Vectorize</div>
                <div className="text-[11px] text-sage-600 mt-0.5">Ollama BGE-M3 Dense Embeddings (1024-dim)</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sage-200 text-center shadow-2xs">
                <div className="text-xs font-bold text-forest-800">3. Retrieve</div>
                <div className="text-[11px] text-sage-600 mt-0.5">Vectorized NumPy Cosine Similarity Search</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sage-200 text-center shadow-2xs">
                <div className="text-xs font-bold text-forest-800">4. Synthesize</div>
                <div className="text-[11px] text-sage-600 mt-0.5">LLaMA 3.2 3B Grounded Generation + Timestamps</div>
              </div>
            </div>
          </div>

          {/* Technical Deep Dive */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">
              Technical Stack & Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-cream-50/60 rounded-xl border border-sage-200 space-y-1">
                <div className="font-bold text-forest-900 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-forest-600" />
                  Local Inference Engine
                </div>
                <p className="text-sage-700">
                  Runs Ollama locally with <strong>LLaMA 3.2 (3B)</strong> for grounded answering and <strong>BGE-M3</strong> for multilingual dense retrieval. Zero external API cost and 100% data privacy.
                </p>
              </div>

              <div className="p-3.5 bg-cream-50/60 rounded-xl border border-sage-200 space-y-1">
                <div className="font-bold text-forest-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-forest-600" />
                  Vector Search Acceleration
                </div>
                <p className="text-sage-700">
                  Pre-normalizes embeddings into NumPy matrix buffers. Queries execute in sub-millisecond matrix multiplication (<code className="bg-white px-1 py-0.5 rounded border border-sage-200">M @ q</code>) without external database bloat.
                </p>
              </div>

              <div className="p-3.5 bg-cream-50/60 rounded-xl border border-sage-200 space-y-1">
                <div className="font-bold text-forest-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-forest-600" />
                  Interactive Video Synchronization
                </div>
                <p className="text-sage-700">
                  Regex parses timestamp citations in LLM responses and transcript chunks into interactive seek anchors that automatically jump the embedded YouTube player.
                </p>
              </div>

              <div className="p-3.5 bg-cream-50/60 rounded-xl border border-sage-200 space-y-1">
                <div className="font-bold text-forest-900 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-forest-600" />
                  Production API Layer
                </div>
                <p className="text-sage-700">
                  Built on <strong>FastAPI</strong> with Pydantic validation, CORS middleware, asynchronous background caching, and automatic transcript chunk aggregation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-cream-50 border-t border-sage-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
