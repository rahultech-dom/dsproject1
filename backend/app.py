import os
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# Ensure project root is on sys.path
PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.rag_engine import RAGEngine

app = FastAPI(
    title="YouTube AI Video RAG API",
    description="Multimodal Video Retrieval-Augmented Generation with local LLaMA 3.2 and BGE-M3",
    version="1.0.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engine
engine = RAGEngine(project_root=PROJECT_ROOT)

# Models
class ChatRequest(BaseModel):
    video_id: str = Field(..., description="YouTube video ID or key")
    query: str = Field(..., description="User question about the video")

class SummarizeRequest(BaseModel):
    video_id: str = Field(..., description="YouTube video ID or key")

class ProcessVideoRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL (e.g. https://www.youtube.com/watch?v=...)")

@app.get("/api/health")
def health_check():
    """Returns status of the backend and connection to Ollama."""
    ollama_info = engine.check_ollama_health()
    return {
        "status": "online",
        "loaded_videos_count": len(engine.videos),
        "ollama": ollama_info
    }

@app.get("/api/videos")
def list_videos():
    """Returns all currently indexed videos."""
    videos_list = []
    for vid, vdata in engine.videos.items():
        videos_list.append({
            "video_id": vid,
            "title": vdata.title,
            "chunks_count": len(vdata.chunks),
            "url": f"https://www.youtube.com/watch?v={vid}" if len(vid) == 11 else f"Demo: {vid}"
        })
    return {"videos": videos_list}

@app.get("/api/chunks/{video_id}")
def get_video_chunks(video_id: str):
    """Retrieve full transcript chunks timeline for a video."""
    if video_id not in engine.videos:
        if engine.videos:
            video_id = next(iter(engine.videos))
        else:
            raise HTTPException(status_code=404, detail="Video not found")
    vdata = engine.videos[video_id]
    return {
        "video_id": video_id,
        "title": vdata.title,
        "chunks": vdata.chunks
    }

@app.post("/api/chat")
def chat_with_video(req: ChatRequest):
    """Query video with BGE-M3 retrieval and LLaMA 3.2 synthesis."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        result = engine.answer_query(video_id=req.video_id, query=req.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize")
def summarize_video(req: SummarizeRequest):
    """Generate executive summary and key takeaways with LLaMA 3.2."""
    try:
        result = engine.summarize_video(video_id=req.video_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process-video")
def process_video(req: ProcessVideoRequest):
    """Ingest, transcribe, chunk, and embed a new YouTube video."""
    if not req.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    try:
        result = engine.process_new_video(url=req.url)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
