import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Play, ChevronDown, ChevronUp, Sparkles, Loader2, ArrowUpRight } from "lucide-react";

// Convert [MM:SS] or [HH:MM:SS] strings into seconds
function parseTimeToSeconds(timeStr) {
  const clean = timeStr.replace(/[\[\]]/g, "").trim();
  const parts = clean.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// Render answer text with clickable timestamp pills
function FormattedAnswer({ text, onSeek }) {
  if (!text) return null;

  // Split by timestamp pattern like [01:23] or [1:23:45]
  const timestampRegex = /(\[\d{1,2}:\d{2}(?::\d{2})?\])/g;
  const parts = text.split(timestampRegex);

  return (
    <div className="prose prose-sm max-w-none text-forest-950 leading-relaxed font-sans space-y-2">
      {text.split("\n\n").map((paragraph, pIdx) => {
        // Check for bullet list items
        if (paragraph.startsWith("* ") || paragraph.startsWith("- ")) {
          const items = paragraph.split("\n").filter(Boolean);
          return (
            <ul key={pIdx} className="list-disc pl-4 space-y-1 my-1">
              {items.map((item, iIdx) => {
                const itemParts = item.replace(/^[\*\-]\s+/, "").split(timestampRegex);
                return (
                  <li key={iIdx}>
                    {renderWithPills(itemParts, onSeek)}
                  </li>
                );
              })}
            </ul>
          );
        }

        const paraParts = paragraph.split(timestampRegex);
        return (
          <p key={pIdx}>
            {renderWithPills(paraParts, onSeek)}
          </p>
        );
      })}
    </div>
  );
}

function renderWithPills(parts, onSeek) {
  const timestampPattern = /^\[\d{1,2}:\d{2}(?::\d{2})?\]$/;
  return parts.map((part, index) => {
    if (timestampPattern.test(part)) {
      const seconds = parseTimeToSeconds(part);
      return (
        <button
          key={index}
          onClick={() => onSeek(seconds)}
          className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md bg-forest-100 hover:bg-forest-200 text-forest-800 border border-forest-300 text-xs font-mono font-semibold transition cursor-pointer"
          title={`Jump video to ${part}`}
        >
          <Play className="w-2.5 h-2.5 fill-forest-700 text-forest-700" />
          <span>{part.replace(/[\[\]]/g, "")}</span>
        </button>
      );
    }
    // Highlight bold text **text**
    if (part.includes("**")) {
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith("**") && bPart.endsWith("**")) {
          return <strong key={bIdx} className="font-semibold text-forest-950">{bPart.slice(2, -2)}</strong>;
        }
        return bPart;
      });
    }
    return part;
  });
}

export default function ChatTab({ messages, isLoading, onSendMessage, onSeek, videoTitle }) {
  const [query, setQuery] = useState("");
  const [expandedSources, setExpandedSources] = useState({});
  const chatEndRef = useRef(null);

  const toggleSources = (index) => {
    setExpandedSources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;
    onSendMessage(query.trim());
    setQuery("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestions = [
    "What is the main purpose of this video?",
    "Explain the core technical concepts covered",
    "Where in the video is the setup or installation discussed?",
    "Summarize the most important takeaways"
  ];

  return (
    <div className="flex flex-col h-[650px] bg-white border border-sage-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-forest-950">
                Ask anything about the video
              </h4>
              <p className="text-xs text-sage-600 max-w-sm mt-1">
                LLaMA 3.2 uses BGE-M3 dense semantic search to retrieve the most relevant moments and generate timestamped answers.
              </p>
            </div>

            {/* Suggested Prompts */}
            <div className="w-full max-w-md space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
                Suggested questions:
              </span>
              <div className="grid grid-cols-1 gap-1.5 text-left">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(s);
                      onSendMessage(s);
                    }}
                    className="w-full p-2.5 rounded-xl bg-cream-50 hover:bg-cream-100 border border-sage-200 text-xs text-forest-900 font-medium transition flex items-center justify-between group cursor-pointer"
                  >
                    <span>{s}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-sage-400 group-hover:text-forest-700 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4 text-forest-100" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                    isUser
                      ? "bg-forest-700 text-white rounded-tr-xs"
                      : "bg-cream-50/80 border border-sage-200 text-forest-950 rounded-tl-xs"
                  }`}
                >
                  {isUser ? (
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  ) : (
                    <div>
                      <FormattedAnswer text={msg.text} onSeek={onSeek} />

                      {/* Source Context Accordion */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-sage-200/80">
                          <button
                            onClick={() => toggleSources(idx)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900 transition cursor-pointer"
                          >
                            <span>Evidence Sources ({msg.sources.length} chunks retrieved)</span>
                            {expandedSources[idx] ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {expandedSources[idx] && (
                            <div className="mt-2 space-y-2">
                              {msg.sources.map((source, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="p-2.5 rounded-xl bg-white border border-sage-200 text-xs space-y-1.5 shadow-2xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <button
                                      onClick={() => onSeek(source.jump_seconds || source.start)}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-forest-100 hover:bg-forest-200 text-forest-800 font-mono font-semibold text-[11px] border border-forest-300 transition cursor-pointer"
                                    >
                                      <Play className="w-2 h-2 fill-forest-700 text-forest-700" />
                                      <span>{source.start_formatted} - {source.end_formatted}</span>
                                    </button>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-sage-500 font-mono">Similarity:</span>
                                      <span className="px-1.5 py-0.2 rounded bg-forest-50 text-forest-800 font-mono font-bold text-[11px] border border-forest-200">
                                        {source.match_percent ? `${source.match_percent}%` : source.similarity}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-sage-800 text-[11px] leading-relaxed italic bg-cream-50 p-2 rounded-lg border border-sage-100">
                                    "{source.text}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-forest-100 border border-forest-300 text-forest-800 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4 text-forest-100" />
            </div>
            <div className="bg-cream-50 border border-sage-200 rounded-2xl rounded-tl-xs p-4 flex items-center gap-3 text-xs text-forest-800 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-forest-600" />
              <span>Retrieving dense vectors & synthesizing with LLaMA 3.2...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-cream-50/70 border-t border-sage-200">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a question about this video (e.g. 'What are the main concepts?')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-sage-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-600 text-sm text-forest-950 placeholder-sage-400 transition"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 disabled:bg-sage-300 text-white font-medium text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
}
