import React, { useState } from "react";
import { X, Copy, Check, Share2, Sparkles } from "lucide-react";

export default function LinkedInModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  const linkedInPostText = `🚀 Excited to share my latest project: TubeMind AI — an Interactive Video RAG System powered by local LLaMA 3.2 & BGE-M3!

Have you ever sat through a 2-hour technical video just to locate one 30-second explanation? I wanted to solve this with local AI.

I built a full-stack Retrieval-Augmented Generation (RAG) platform that turns long-form YouTube videos into an interactive, question-answering intelligence dashboard with zero cloud API costs.

✨ Key Highlights:
🔹 Local & Private AI: Powered by Ollama running Meta's LLaMA 3.2 (3B) for contextual synthesis and BGE-M3 for high-density multilingual embeddings.
🔹 Vectorized Similarity Search: Transcripts are segmented into timestamped semantic chunks and indexed into normalized vector matrices for sub-millisecond retrieval.
🔹 Bidirectional Video Sync: Every AI citation includes clickable [MM:SS] timestamp chips. Clicking a citation instantly jumps the embedded YouTube player to that exact second!
🔹 Video Intelligence Engine: 1-click executive summaries, key takeaways, and searchable transcript explorer.
🔹 Modern Full-Stack Architecture: React (Vite, Tailwind CSS, Lucide Icons) styled in an elegant Cream, Sage Green & White palette, backed by a high-throughput FastAPI service.

🛠️ Tech Stack: Python, FastAPI, NumPy, Pandas, Ollama, LLaMA 3.2, BGE-M3, React, Tailwind CSS.

Check out the GitHub repo and let me know your thoughts! 👇
#ArtificialIntelligence #MachineLearning #RAG #LLaMA #DataScience #WebDevelopment #ReactJS #Python #Ollama #OpenSource`;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkedInPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-sage-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-cream-50 border-b border-sage-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0077B5] text-white flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.4 10.24v-8.37H5.06v8.37h2.8Z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-forest-950">
                LinkedIn Showcase Post Kit
              </h3>
              <p className="text-xs text-sage-600">
                Ready-to-publish announcement draft showcasing your engineering stack
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
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sage-600">
              Post Template (Formatted with emojis, metrics & hashtags):
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cream-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied to Clipboard!" : "Copy Post"}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-sage-200 font-sans text-xs text-forest-950 whitespace-pre-wrap leading-relaxed shadow-inner max-h-80 overflow-y-auto">
            {linkedInPostText}
          </div>

          {/* Quick Posting Tips */}
          <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-forest-800">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              Pro Tips for Maximum LinkedIn Reach:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-sage-800 text-[11px]">
              <li>Record a short 20-30 second video of you asking a question and clicking the timestamp to show the video jumping to the exact spot.</li>
              <li>Include your GitHub repository link in the comments or post body.</li>
              <li>Mention you built this using local LLaMA 3.2 on Ollama with zero external API costs.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-cream-50 border-t border-sage-200 flex items-center justify-between">
          <span className="text-[11px] text-sage-500 font-medium">
            Paste directly into LinkedIn post editor
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-forest-900 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Post"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
