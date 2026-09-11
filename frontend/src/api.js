import { DEMO_VIDEOS, DEMO_CHUNKS, DEMO_PRESET_ANSWERS } from "./demoData";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    // If backend is offline (e.g. running standalone on Vercel)
    return {
      status: "web-demo",
      isDemoMode: true,
      ollama: {
        connected: false,
        llama3_2_ready: true,
        bge_m3_ready: true,
        notice: "Live on Vercel • Interactive Demo Mode"
      }
    };
  }
}

export async function fetchVideos() {
  try {
    const res = await fetch(`${API_BASE}/videos`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("Failed to fetch videos");
    return await res.json();
  } catch (err) {
    return { videos: DEMO_VIDEOS };
  }
}

export async function fetchVideoChunks(videoId) {
  try {
    const res = await fetch(`${API_BASE}/chunks/${videoId}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("Failed to fetch chunks");
    return await res.json();
  } catch (err) {
    return {
      video_id: videoId || "_bM7HK530PE",
      title: "C++ Programming Full Course (Demo)",
      chunks: DEMO_CHUNKS
    };
  }
}

export async function sendChatMessage(videoId, query) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: videoId, query }),
      signal: AbortSignal.timeout(180000)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to generate answer");
    }
    return await res.json();
  } catch (err) {
    // Graceful fallback for Vercel demo visitors
    if (err.name === "TypeError" || err.message.includes("Failed to fetch")) {
      await new Promise((r) => setTimeout(r, 900));
      return {
        answer: `**Answer for "${query}":**\n\n* **C++ Core Concepts**: C++ is a compiled, statically-typed language designed for optimal execution efficiency [00:10].\n* **Compilation Model**: The source code is compiled into native machine instructions [00:25] without intermediate bytecode interpretation.\n* **Pointers & Memory Architecture**: Pointers store actual hardware memory addresses [01:12], enabling direct heap control.\n\n*(Note: Running in Interactive Web Demo mode on Vercel. For live local generation, launch Ollama + FastAPI locally).*`,
        sources: DEMO_PRESET_ANSWERS.default.sources,
        video_id: videoId,
        video_title: "C++ Programming Full Course (Demo)"
      };
    }
    throw err;
  }
}

export async function fetchSummary(videoId) {
  try {
    const res = await fetch(`${API_BASE}/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: videoId }),
      signal: AbortSignal.timeout(180000)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to generate summary");
    }
    return await res.json();
  } catch (err) {
    if (err.name === "TypeError" || err.message.includes("Failed to fetch")) {
      await new Promise((r) => setTimeout(r, 800));
      return {
        summary: DEMO_PRESET_ANSWERS.summary,
        video_id: videoId,
        video_title: "C++ Programming Full Course (Demo)",
        total_chunks: DEMO_CHUNKS.length
      };
    }
    throw err;
  }
}

export async function processNewVideo(url) {
  const res = await fetch(`${API_BASE}/process-video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to process video");
  }
  return await res.json();
}
