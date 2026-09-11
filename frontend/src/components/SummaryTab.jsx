import React, { useState } from "react";
import { Sparkles, Copy, Check, Play, RefreshCw, FileText, Loader2 } from "lucide-react";

function parseTimeToSeconds(timeStr) {
  const clean = timeStr.replace(/[\[\]]/g, "").trim();
  const parts = clean.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export default function SummaryTab({ summaryData, isLoading, onGenerate, onSeek, videoTitle }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!summaryData?.summary) return;
    navigator.clipboard.writeText(summaryData.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timestampRegex = /(\[\d{1,2}:\d{2}(?::\d{2})?\])/g;

  return (
    <div className="bg-white border border-sage-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[650px]">
      {/* Header */}
      <div className="p-4 bg-cream-50/80 border-b border-sage-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-forest-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900">
            Executive Intelligence & Chapters
          </span>
        </div>
        <div className="flex items-center gap-2">
          {summaryData?.summary && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs font-medium border border-cream-300 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-forest-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          )}
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest-700 hover:bg-forest-800 disabled:bg-sage-300 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>{summaryData?.summary ? "Regenerate" : "Generate"}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
            <h4 className="text-sm font-semibold text-forest-900">
              Generating Executive Analysis with LLaMA 3.2...
            </h4>
            <p className="text-xs text-sage-600 max-w-sm">
              Analyzing transcript segments across the entire timeline to synthesize core concepts and key takeaways.
            </p>
          </div>
        ) : !summaryData?.summary ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-forest-950">
                No Summary Generated Yet
              </h4>
              <p className="text-xs text-sage-600 max-w-md mt-1">
                Click below to synthesize this video into an executive summary, high-yield takeaways, and timeline chapters.
              </p>
            </div>
            <button
              onClick={onGenerate}
              className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-sm font-semibold shadow-xs transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cream-200" />
              <span>Generate Summary with LLaMA 3.2</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-forest-950 text-sm leading-relaxed font-sans">
            {summaryData.summary.split("\n\n").map((section, sIdx) => {
              // Section headings
              if (section.startsWith("#") || section.startsWith("**1.") || section.startsWith("**2.") || section.startsWith("**3.")) {
                return (
                  <div key={sIdx} className="pt-2 border-t border-sage-100 first:border-t-0 first:pt-0">
                    <h4 className="font-bold text-base text-forest-900 mb-1">
                      {section.replace(/^#+\s*/, "").replace(/\*\*/g, "")}
                    </h4>
                  </div>
                );
              }

              // Bullet points
              if (section.startsWith("* ") || section.startsWith("- ")) {
                const lines = section.split("\n").filter(Boolean);
                return (
                  <ul key={sIdx} className="space-y-2 my-2">
                    {lines.map((line, lIdx) => {
                      const cleanLine = line.replace(/^[\*\-]\s+/, "");
                      const parts = cleanLine.split(timestampRegex);
                      return (
                        <li key={lIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-2 shrink-0" />
                          <div className="flex-1">
                            {parts.map((part, pIdx) => {
                              if (timestampRegex.test(part)) {
                                const secs = parseTimeToSeconds(part);
                                return (
                                  <button
                                    key={pIdx}
                                    onClick={() => onSeek(secs)}
                                    className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded bg-forest-100 hover:bg-forest-200 text-forest-800 border border-forest-300 font-mono text-xs font-semibold cursor-pointer"
                                  >
                                    <Play className="w-2.5 h-2.5 fill-forest-700 text-forest-700" />
                                    <span>{part.replace(/[\[\]]/g, "")}</span>
                                  </button>
                                );
                              }
                              if (part.includes("**")) {
                                const bParts = part.split(/(\*\*.*?\*\*)/g);
                                return bParts.map((bp, bpIdx) =>
                                  bp.startsWith("**") ? (
                                    <strong key={bpIdx} className="font-semibold text-forest-950">{bp.slice(2, -2)}</strong>
                                  ) : bp
                                );
                              }
                              return part;
                            })}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              // Normal paragraphs with timestamp pills
              const parts = section.split(timestampRegex);
              return (
                <p key={sIdx} className="text-forest-950">
                  {parts.map((part, pIdx) => {
                    if (timestampRegex.test(part)) {
                      const secs = parseTimeToSeconds(part);
                      return (
                        <button
                          key={pIdx}
                          onClick={() => onSeek(secs)}
                          className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded bg-forest-100 hover:bg-forest-200 text-forest-800 border border-forest-300 font-mono text-xs font-semibold cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-forest-700 text-forest-700" />
                          <span>{part.replace(/[\[\]]/g, "")}</span>
                        </button>
                      );
                    }
                    if (part.includes("**")) {
                      const bParts = part.split(/(\*\*.*?\*\*)/g);
                      return bParts.map((bp, bpIdx) =>
                        bp.startsWith("**") ? (
                          <strong key={bpIdx} className="font-semibold text-forest-950">{bp.slice(2, -2)}</strong>
                        ) : bp
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
