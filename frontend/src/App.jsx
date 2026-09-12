import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import VideoBar from "./components/VideoBar";
import VideoPlayer from "./components/VideoPlayer";
import ChatTab from "./components/ChatTab";
import SummaryTab from "./components/SummaryTab";
import ChunksTab from "./components/ChunksTab";
import ArchitectureModal from "./components/ArchitectureModal";
import LinkedInModal from "./components/LinkedInModal";
import ApiKeyModal from "./components/ApiKeyModal";
import {
  fetchHealth,
  fetchVideos,
  fetchVideoChunks,
  sendChatMessage,
  fetchSummary,
  processNewVideo,
  getGroqApiKey
} from "./api";
import { MessageSquare, FileText, Layers, Video } from "lucide-react";

export default function App() {
  const [health, setHealth] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [seekSeconds, setSeekSeconds] = useState(0);

  // Tab state: 'chat' | 'summary' | 'chunks'
  const [activeTab, setActiveTab] = useState("chat");

  // Chat state
  const [messages, setMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Summaries cached by video_id
  const [summaries, setSummaries] = useState({});
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState("");
  const [notification, setNotification] = useState(null);

  // Modals
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isLinkedInOpen, setIsLinkedInOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasGroqKey, setHasGroqKey] = useState(Boolean(getGroqApiKey()));

  // Initialize data
  useEffect(() => {
    async function init() {
      const hData = await fetchHealth();
      setHealth(hData);

      try {
        const vData = await fetchVideos();
        if (vData.videos && vData.videos.length > 0) {
          setVideos(vData.videos);
          const first = vData.videos[0];
          setActiveVideoId(first.video_id);
          setActiveVideo(first);
        }
      } catch (err) {
        console.error("Failed to load initial videos:", err);
      }
    }
    init();
  }, []);

  // When activeVideoId changes, load chunks
  useEffect(() => {
    if (!activeVideoId) return;
    const current = videos.find((v) => v.video_id === activeVideoId);
    if (current) setActiveVideo(current);

    async function loadChunks() {
      try {
        const data = await fetchVideoChunks(activeVideoId);
        setChunks(data.chunks || []);
      } catch (err) {
        console.error("Failed to load chunks:", err);
      }
    }
    loadChunks();
    // Reset seek on video change
    setSeekSeconds(0);
  }, [activeVideoId, videos]);

  // Handle Seek
  const handleSeek = (seconds) => {
    setSeekSeconds(seconds);
    // Visual notification
    setNotification({
      type: "info",
      text: `Jumped video to ${Math.floor(seconds / 60)}:${(Math.floor(seconds) % 60).toString().padStart(2, "0")}`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle Process New Video
  const handleProcessVideo = async (url) => {
    setIsProcessing(true);
    setProcessProgress("Step 1/3: Extracting Spoken Transcript from YouTube...");
    setNotification(null);

    const progressTimer = setTimeout(() => {
      setProcessProgress("Step 2/3: Creating Semantic Timestamped Chunks...");
    }, 4000);

    const progressTimer2 = setTimeout(() => {
      setProcessProgress("Step 3/3: Vectorizing with Ollama BGE-M3 Embeddings...");
    }, 8000);

    try {
      const res = await processNewVideo(url);
      clearTimeout(progressTimer);
      clearTimeout(progressTimer2);

      // Refresh videos
      const vData = await fetchVideos();
      setVideos(vData.videos || []);
      setActiveVideoId(res.video_id);

      setNotification({
        type: "success",
        text: `Success! ${res.title} indexed with ${res.chunks_count} chunks.`
      });
      setTimeout(() => setNotification(null), 6000);
    } catch (err) {
      clearTimeout(progressTimer);
      clearTimeout(progressTimer2);
      setNotification({
        type: "error",
        text: err.message || "Could not process this video. Please verify the URL."
      });
    } finally {
      setIsProcessing(false);
      setProcessProgress("");
    }
  };

  // Handle Chat Message
  const handleSendMessage = async (queryText) => {
    if (!activeVideoId) return;

    // Add user message
    const userMsg = { role: "user", text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await sendChatMessage(activeVideoId, queryText);
      const assistantMsg = {
        role: "assistant",
        text: res.answer,
        sources: res.sources || []
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ Error: ${err.message}. Please check if Ollama is running.`
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Generate Summary
  const handleGenerateSummary = async () => {
    if (!activeVideoId) return;
    setActiveTab("summary");
    setIsSummaryLoading(true);

    try {
      const res = await fetchSummary(activeVideoId);
      setSummaries((prev) => ({
        ...prev,
        [activeVideoId]: res
      }));
    } catch (err) {
      setNotification({
        type: "error",
        text: `Failed to generate summary: ${err.message}`
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        health={health}
        onOpenArch={() => setIsArchOpen(true)}
        onOpenLinkedIn={() => setIsLinkedInOpen(true)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        hasGroqKey={hasGroqKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Ingestion & Video Selection Bar */}
        <VideoBar
          videos={videos}
          activeVideoId={activeVideoId}
          onSelectVideo={(id) => setActiveVideoId(id)}
          onProcessVideo={handleProcessVideo}
          isProcessing={isProcessing}
          processProgress={processProgress}
          notification={notification}
        />

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Synchronized Video Player & Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <VideoPlayer
              videoId={activeVideoId}
              videoTitle={activeVideo?.title}
              chunksCount={chunks.length}
              seekSeconds={seekSeconds}
              onGenerateSummary={handleGenerateSummary}
              onOpenChunks={() => setActiveTab("chunks")}
            />

            {/* Quick Metrics Card */}
            <div className="bg-white border border-sage-200 rounded-2xl p-4 shadow-xs text-xs space-y-2.5">
              <div className="flex items-center justify-between font-semibold text-forest-900">
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-forest-600" />
                  RAG Pipeline Status
                </span>
                <span className="px-2 py-0.5 rounded bg-forest-50 text-forest-700 font-mono border border-forest-200">
                  Ready
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-sage-700">
                <div className="bg-cream-50/70 p-2 rounded-xl border border-sage-100">
                  <div className="text-[10px] uppercase tracking-wider text-sage-500 font-medium">LLM Model</div>
                  <div className="font-bold text-forest-950 mt-0.5">LLaMA 3.2 (3B)</div>
                </div>
                <div className="bg-cream-50/70 p-2 rounded-xl border border-sage-100">
                  <div className="text-[10px] uppercase tracking-wider text-sage-500 font-medium">Embedding Model</div>
                  <div className="font-bold text-forest-950 mt-0.5">BGE-M3 (Dense)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Intelligence Interface (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Tab Navigation Buttons */}
            <div className="flex items-center gap-2 p-1.5 bg-cream-200/80 rounded-2xl border border-sage-200/80">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-forest-800 text-white shadow-xs"
                    : "text-forest-900 hover:bg-cream-300/60"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Video Chat</span>
              </button>

              <button
                onClick={() => setActiveTab("summary")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "summary"
                    ? "bg-forest-800 text-white shadow-xs"
                    : "text-forest-900 hover:bg-cream-300/60"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Executive Summary</span>
              </button>

              <button
                onClick={() => setActiveTab("chunks")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "chunks"
                    ? "bg-forest-800 text-white shadow-xs"
                    : "text-forest-900 hover:bg-cream-300/60"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Transcript Chunks ({chunks.length})</span>
              </button>
            </div>

            {/* Tab Content Panels */}
            {activeTab === "chat" && (
              <ChatTab
                messages={messages}
                isLoading={isChatLoading}
                onSendMessage={handleSendMessage}
                onSeek={handleSeek}
                videoTitle={activeVideo?.title}
              />
            )}

            {activeTab === "summary" && (
              <SummaryTab
                summaryData={summaries[activeVideoId]}
                isLoading={isSummaryLoading}
                onGenerate={handleGenerateSummary}
                onSeek={handleSeek}
                videoTitle={activeVideo?.title}
              />
            )}

            {activeTab === "chunks" && (
              <ChunksTab
                chunks={chunks}
                onSeek={handleSeek}
                videoTitle={activeVideo?.title}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-cream-50 border-t border-sage-200 mt-12 py-6 px-4 text-center text-xs text-sage-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TubeMind AI • Multimodal Video RAG System</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchOpen(true)}
              className="hover:text-forest-800 underline transition cursor-pointer"
            >
              Architecture Specs
            </button>
            <span>•</span>
            <button
              onClick={() => setIsLinkedInOpen(true)}
              className="hover:text-forest-800 underline transition cursor-pointer text-forest-700 font-semibold"
            >
              LinkedIn Post Kit
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
      <LinkedInModal isOpen={isLinkedInOpen} onClose={() => setIsLinkedInOpen(false)} />
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeySaved={() => setHasGroqKey(Boolean(getGroqApiKey()))}
      />
    </div>
  );
}
