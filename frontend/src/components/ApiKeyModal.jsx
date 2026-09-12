import React, { useState, useEffect } from "react";
import { X, Key, Check, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import { getGroqApiKey, setGroqApiKey } from "../api";

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getGroqApiKey());
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    setGroqApiKey(apiKey.trim());
    setSaved(true);
    if (onKeySaved) onKeySaved();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setGroqApiKey("");
    setApiKey("");
    if (onKeySaved) onKeySaved();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-sage-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-cream-50 border-b border-sage-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-xs">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-forest-950">
                Cloud LLaMA 3.2 Key
              </h3>
              <p className="text-xs text-sage-600">
                Enable free, live LLaMA 3.2 (3B) inference in the cloud
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

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-forest-50/80 border border-forest-200 text-xs text-forest-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-forest-800">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              100% Free & Instant (No Credit Card)
            </div>
            <p className="text-sage-700 text-[11px] leading-relaxed">
              Get your free API key in 10 seconds from Groq to run real <strong>LLaMA 3.2 (3B)</strong> at 300+ tokens/sec directly on Vercel:
            </p>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-forest-700 hover:text-forest-900 font-bold underline transition"
            >
              Get Free Groq Key at console.groq.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-900">
              Groq API Key:
            </label>
            <input
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 bg-cream-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-600 text-xs font-mono text-forest-950 placeholder-sage-400 transition"
            />
            <p className="text-[10px] text-sage-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-forest-600" />
              Saved securely in your browser localStorage. Never sent to any third-party server.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2 border-t border-sage-100">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
              >
                Clear Key
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-forest-900 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saved ? "Saved & Activated!" : "Save & Activate"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
