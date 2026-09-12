import React from "react";
import { Sparkles, Cpu, Layers, Share2, Server, Key, CheckCircle2, AlertCircle } from "lucide-react";

export default function Navbar({ health, onOpenArch, onOpenLinkedIn, onOpenKeyModal, hasGroqKey }) {
  const isOllamaOnline = health?.ollama?.connected;
  const hasLlama = health?.ollama?.llama3_2_ready;
  const hasEmbed = health?.ollama?.bge_m3_ready;

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-sage-200 px-4 sm:px-8 py-3.5 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-forest-800 to-forest-600 flex items-center justify-center text-white shadow-md shadow-forest-900/10">
            <Sparkles className="w-5 h-5 text-forest-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-forest-950 font-sans">
                TubeMind <span className="text-forest-600">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-forest-100 text-forest-800 border border-forest-200">
                Local RAG
              </span>
            </div>
            <p className="text-xs text-sage-600">
              Interactive Video Intelligence powered by LLaMA 3.2 & BGE-M3
            </p>
          </div>
        </div>

        {/* Model & System Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              isOllamaOnline
                ? "bg-forest-50 text-forest-800 border-forest-300"
                : health?.isDemoMode
                ? "bg-sky-50 text-sky-800 border-sky-300"
                : "bg-amber-50 text-amber-800 border-amber-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOllamaOnline
                  ? "bg-forest-500 animate-pulse"
                  : health?.isDemoMode
                  ? "bg-sky-500 animate-pulse"
                  : "bg-amber-500"
              }`}
            />
            <span className="font-medium">
              {isOllamaOnline ? "Ollama Online" : health?.isDemoMode ? "Vercel Cloud Demo" : "Ollama Offline"}
            </span>
          </div>

          {/* LLaMA 3.2 Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-sage-200 text-forest-900 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-forest-600" />
            <span className="font-semibold">LLaMA 3.2</span>
            <span className="text-[10px] text-sage-500 font-mono">(3B)</span>
          </div>

          {/* BGE-M3 Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-sage-200 text-forest-900 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-forest-600" />
            <span className="font-semibold">BGE-M3</span>
            <span className="text-[10px] text-sage-500 font-mono">(Dense)</span>
          </div>

          <div className="h-4 w-[1px] bg-sage-300 mx-1 hidden sm:block" />

          {/* Cloud Key Modal Trigger */}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
              hasGroqKey
                ? "bg-forest-100 text-forest-900 border-forest-400"
                : "bg-cream-200/80 hover:bg-cream-300 text-forest-900 border-cream-400/60"
            }`}
            title="Configure free Groq LLaMA 3.2 Cloud Key"
          >
            <Key className="w-3.5 h-3.5 text-forest-700" />
            <span>{hasGroqKey ? "Cloud LLaMA Live" : "Free Cloud Key"}</span>
          </button>

          {/* Architecture Modal Trigger */}
          <button
            onClick={onOpenArch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream-200/80 hover:bg-cream-300 text-forest-900 border border-cream-400/60 font-medium transition cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-forest-700" />
            <span>Architecture</span>
          </button>

          {/* LinkedIn Showcase Button */}
          <button
            onClick={onOpenLinkedIn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-700 hover:bg-forest-800 text-white font-medium shadow-sm transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>LinkedIn Showcase</span>
          </button>
        </div>
      </div>
    </header>
  );
}
