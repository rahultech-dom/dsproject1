import os
import re
import json
import time
import requests
import numpy as np
import pandas as pd
import ast
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL = os.getenv("EMBED_MODEL", "bge-m3")
CHAT_MODEL = os.getenv("CHAT_MODEL", "llama3.2")

def format_timestamp(seconds: float) -> str:
    """Convert seconds to HH:MM:SS or MM:SS format."""
    total_seconds = int(seconds)
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"

def extract_video_id(url: str) -> Optional[str]:
    """Extract YouTube Video ID from various URL formats."""
    parsed = urlparse(url.strip())
    if "youtube.com" in parsed.netloc:
        query_params = parse_qs(parsed.query)
        if "v" in query_params:
            return query_params["v"][0]
        # Check /embed/ or /v/ paths
        path_parts = parsed.path.strip("/").split("/")
        if len(path_parts) >= 2 and path_parts[0] in ("embed", "v", "shorts"):
            return path_parts[1]
    elif "youtu.be" in parsed.netloc:
        return parsed.path.strip("/").split("?")[0]
    elif len(url.strip()) == 11 and re.match(r"^[A-Za-z0-9_-]{11}$", url.strip()):
        return url.strip()
    return None

class VideoData:
    def __init__(self, video_id: str, title: str, chunks: List[Dict[str, Any]], embeddings: Optional[np.ndarray] = None):
        self.video_id = video_id
        self.title = title
        self.chunks = chunks
        self.embeddings = embeddings  # normalized matrix (N, D)

class RAGEngine:
    def __init__(self, project_root: str):
        self.project_root = project_root
        self.videos: Dict[str, VideoData] = {}
        self.storage_dir = os.path.join(project_root, "video_store")
        os.makedirs(self.storage_dir, exist_ok=True)
        self.load_default_or_saved_videos()

    def check_ollama_health(self) -> Dict[str, Any]:
        """Check Ollama availability and loaded models."""
        try:
            r = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
            if r.status_code == 200:
                models = [m.get("name", "") for m in r.json().get("models", [])]
                has_llama = any("llama3.2" in m for m in models)
                has_embed = any("bge-m3" in m for m in models)
                return {
                    "connected": True,
                    "models": models,
                    "llama3_2_ready": has_llama,
                    "bge_m3_ready": has_embed,
                    "chat_model": CHAT_MODEL,
                    "embed_model": EMBED_MODEL
                }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "models": [],
                "llama3_2_ready": False,
                "bge_m3_ready": False
            }
        return {"connected": False, "models": []}

    def load_default_or_saved_videos(self):
        """Pre-load existing embedded_chunks.csv from the repo as demo video and check saved cache."""
        cache_matrix_path = os.path.join(self.storage_dir, "default_matrix.npy")
        cache_chunks_path = os.path.join(self.storage_dir, "default_chunks.json")

        # Check if fast binary cache exists
        if os.path.exists(cache_matrix_path) and os.path.exists(cache_chunks_path):
            try:
                with open(cache_chunks_path, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                embeddings = np.load(cache_matrix_path)
                video_id = meta.get("video_id", "_bM7HK530PE")
                self.videos[video_id] = VideoData(
                    video_id=video_id,
                    title=meta.get("title", "C++ Programming Full Course (Demo)"),
                    chunks=meta.get("chunks", []),
                    embeddings=embeddings
                )
                print(f"[RAGEngine] Loaded cached default video {video_id} ({len(meta['chunks'])} chunks)")
                return
            except Exception as e:
                print(f"[RAGEngine] Error loading fast cache: {e}")

        # Try loading from embedded_chunks.csv or chunks.json
        csv_path = os.path.join(self.project_root, "embedded_chunks.csv")
        json_path = os.path.join(self.project_root, "chunks.json")

        if os.path.exists(csv_path):
            try:
                print(f"[RAGEngine] Indexing default embedded_chunks.csv...")
                df = pd.read_csv(csv_path)
                chunks = []
                vectors = []
                video_id = "_bM7HK530PE" # Mosh C++ Course
                title = "C++ Programming Full Course (Demo)"

                for _, row in df.iterrows():
                    raw_emb = row["embedding"]
                    if isinstance(raw_emb, str):
                        vec = ast.literal_eval(raw_emb)
                    else:
                        vec = list(raw_emb)
                    vectors.append(vec)
                    chunks.append({
                        "chunk_id": int(row.get("chunk_id", len(chunks))),
                        "title": title,
                        "start": float(row.get("start", 0)),
                        "end": float(row.get("end", 0)),
                        "start_formatted": format_timestamp(float(row.get("start", 0))),
                        "end_formatted": format_timestamp(float(row.get("end", 0))),
                        "text": str(row.get("text", "")).strip()
                    })

                embeddings = np.array(vectors, dtype=np.float32)
                # L2 normalize
                norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
                norms[norms == 0] = 1e-10
                embeddings = embeddings / norms

                self.videos[video_id] = VideoData(
                    video_id=video_id,
                    title=title,
                    chunks=chunks,
                    embeddings=embeddings
                )

                # Save fast binary cache for subsequent instant boots
                np.save(cache_matrix_path, embeddings)
                with open(cache_chunks_path, "w", encoding="utf-8") as f:
                    json.dump({
                        "video_id": video_id,
                        "title": title,
                        "chunks": chunks
                    }, f, ensure_ascii=False)

                print(f"[RAGEngine] Successfully pre-loaded demo video with {len(chunks)} chunks!")
            except Exception as e:
                print(f"[RAGEngine] Error loading embedded_chunks.csv: {e}")

    def embed_text(self, text: str) -> np.ndarray:
        """Create normalized embedding using Ollama BGE-M3."""
        r = requests.post(
            f"{OLLAMA_BASE_URL}/api/embed",
            json={"model": EMBED_MODEL, "input": [text]},
            timeout=120
        )
        r.raise_for_status()
        vec = np.array(r.json()["embeddings"][0], dtype=np.float32)
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def embed_batch(self, texts: List[str], batch_size: int = 16) -> np.ndarray:
        """Create normalized embeddings for a batch of texts with high throughput."""
        all_vecs = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            r = requests.post(
                f"{OLLAMA_BASE_URL}/api/embed",
                json={"model": EMBED_MODEL, "input": batch},
                timeout=180
            )
            r.raise_for_status()
            batch_vecs = r.json()["embeddings"]
            all_vecs.extend(batch_vecs)

        matrix = np.array(all_vecs, dtype=np.float32)
        norms = np.linalg.norm(matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1e-10
        return matrix / norms

    def retrieve(self, video_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve top_k most semantically relevant chunks for a video."""
        if video_id not in self.videos:
            # Fallback to the first available video if video_id not explicitly found
            if self.videos:
                video_id = next(iter(self.videos))
            else:
                return []

        video = self.videos[video_id]
        if video.embeddings is None or len(video.chunks) == 0:
            return []

        query_vec = self.embed_text(query)
        # Vectorized cosine similarity
        similarities = np.dot(video.embeddings, query_vec)

        # Get top-k indices
        top_indices = np.argsort(similarities)[::-1][:top_k]

        results = []
        for idx in top_indices:
            chunk = dict(video.chunks[idx])
            sim = float(similarities[idx])
            chunk["similarity"] = round(sim, 4)
            chunk["match_percent"] = round(max(0.0, sim) * 100, 1)
            chunk["jump_seconds"] = int(chunk["start"])
            results.append(chunk)

        return results

    def answer_query(self, video_id: str, query: str, chat_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """Perform RAG: Retrieve context + Generate response with LLaMA 3.2."""
        retrieved_chunks = self.retrieve(video_id, query, top_k=5)
        video_title = self.videos[video_id].title if video_id in self.videos else "Video"

        context_lines = []
        for c in retrieved_chunks:
            context_lines.append(
                f"[{c['start_formatted']} - {c['end_formatted']}] {c['text']}"
            )
        context_str = "\n".join(context_lines)

        system_instruction = (
            "You are an intelligent, highly accurate AI Assistant analyzing a YouTube video transcript.\n"
            f"Video Title: {video_title}\n\n"
            "INSTRUCTIONS:\n"
            "1. Answer the user's question clearly, thoroughly, and directly using ONLY information from the context transcript below.\n"
            "2. Cite timestamps in [MM:SS] format whenever you mention specific facts, concepts, or explanations from the video.\n"
            "3. Format your response cleanly using markdown (bullet points, bold highlights, concise paragraphs).\n"
            "4. If the transcript segments do not contain enough information to fully answer the question, state what is mentioned in the transcript and acknowledge the limitation politely."
        )

        user_prompt = (
            f"VIDEO TRANSCRIPT CONTEXT:\n{context_str}\n\n"
            f"USER QUESTION: {query}\n\n"
            "Please provide a structured, well-explained answer with timestamp references:"
        )

        # Build messages or prompt for Ollama
        try:
            r = requests.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": CHAT_MODEL,
                    "prompt": f"{system_instruction}\n\n{user_prompt}",
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "num_predict": 750
                    }
                },
                timeout=180
            )
            r.raise_for_status()
            answer_text = r.json().get("response", "")
        except Exception as e:
            answer_text = f"An error occurred while generating response with {CHAT_MODEL}: {str(e)}"

        return {
            "answer": answer_text,
            "sources": retrieved_chunks,
            "video_id": video_id,
            "video_title": video_title
        }

    def summarize_video(self, video_id: str) -> Dict[str, Any]:
        """Generate structured executive summary and key takeaways."""
        if video_id not in self.videos:
            if self.videos:
                video_id = next(iter(self.videos))
            else:
                return {"error": "No video available."}

        video = self.videos[video_id]
        # Sample chunks across the video to fit context comfortably
        sample_step = max(1, len(video.chunks) // 25)
        sampled = video.chunks[::sample_step][:25]

        transcript_sample = "\n".join([
            f"[{c['start_formatted']}] {c['text']}" for c in sampled
        ])

        prompt = (
            f"You are a technical content analyst. Analyze the following transcript highlights from '{video.title}':\n\n"
            f"{transcript_sample}\n\n"
            "Generate a professional, high-value summary formatted in clean markdown with:\n"
            "1. **Executive Summary**: 2 concise paragraphs summarizing the main topic and mission.\n"
            "2. **Key Takeaways**: 4-6 bullet points highlighting core concepts covered.\n"
            "3. **Timeline Highlights**: 3-5 key milestones with [MM:SS] timestamps."
        )

        try:
            r = requests.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": CHAT_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.2, "num_predict": 800}
                },
                timeout=180
            )
            r.raise_for_status()
            summary = r.json().get("response", "")
        except Exception as e:
            summary = f"Could not generate summary: {str(e)}"

        return {
            "summary": summary,
            "video_id": video_id,
            "video_title": video.title,
            "total_chunks": len(video.chunks)
        }

    def process_new_video(self, url: str) -> Dict[str, Any]:
        """Fetch transcript for a new YouTube video, chunk it, embed it with BGE-M3, and index it."""
        video_id = extract_video_id(url)
        if not video_id:
            raise ValueError("Invalid YouTube URL. Please provide a valid youtube.com or youtu.be link.")

        # Check if already processed in memory
        if video_id in self.videos:
            return {
                "video_id": video_id,
                "title": self.videos[video_id].title,
                "chunks_count": len(self.videos[video_id].chunks),
                "message": "Video is already indexed and ready!"
            }

        title = f"YouTube Video ({video_id})"
        try:
            # Attempt to fetch title via oEmbed
            meta_res = requests.get(f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json", timeout=5)
            if meta_res.status_code == 200:
                title = meta_res.json().get("title", title)
        except Exception:
            pass

        # Fetch transcript
        api = YouTubeTranscriptApi()
        try:
            transcript_items = api.fetch(video_id)
        except Exception as e:
            # Also try class method get_transcript if present
            try:
                transcript_items = YouTubeTranscriptApi.get_transcript(video_id)
            except Exception as e2:
                raise RuntimeError(f"Could not retrieve transcript from YouTube: {str(e)}")

        raw_chunks = []
        for i, item in enumerate(transcript_items):
            # item may be an object or dict depending on library version
            if hasattr(item, "start"):
                start = float(item.start)
                duration = float(item.duration)
                text = str(item.text).strip()
            elif isinstance(item, dict):
                start = float(item.get("start", 0))
                duration = float(item.get("duration", 0))
                text = str(item.get("text", "")).strip()
            else:
                continue

            if not text:
                continue

            raw_chunks.append({
                "start": start,
                "end": start + duration,
                "text": text
            })

        if not raw_chunks:
            raise RuntimeError("No spoken transcript found for this video.")

        # Aggregate short transcript segments into coherent ~30-second semantic chunks
        aggregated_chunks = []
        current_texts = []
        current_start = raw_chunks[0]["start"]
        current_end = raw_chunks[0]["end"]

        for item in raw_chunks:
            current_texts.append(item["text"])
            current_end = item["end"]
            # Group into ~25-45 second chunks or 40+ words
            word_count = sum(len(t.split()) for t in current_texts)
            if (current_end - current_start) >= 30 or word_count >= 50:
                aggregated_chunks.append({
                    "chunk_id": len(aggregated_chunks),
                    "title": title,
                    "start": round(current_start, 2),
                    "end": round(current_end, 2),
                    "start_formatted": format_timestamp(current_start),
                    "end_formatted": format_timestamp(current_end),
                    "text": " ".join(current_texts)
                })
                current_texts = []
                current_start = item["end"]

        if current_texts:
            aggregated_chunks.append({
                "chunk_id": len(aggregated_chunks),
                "title": title,
                "start": round(current_start, 2),
                "end": round(current_end, 2),
                "start_formatted": format_timestamp(current_start),
                "end_formatted": format_timestamp(current_end),
                "text": " ".join(current_texts)
            })

        # Generate embeddings with BGE-M3
        texts_to_embed = [c["text"] for c in aggregated_chunks]
        embeddings = self.embed_batch(texts_to_embed, batch_size=8)

        # Save to video store
        video_data = VideoData(
            video_id=video_id,
            title=title,
            chunks=aggregated_chunks,
            embeddings=embeddings
        )
        self.videos[video_id] = video_data

        video_cache_file = os.path.join(self.storage_dir, f"{video_id}_chunks.json")
        matrix_cache_file = os.path.join(self.storage_dir, f"{video_id}_matrix.npy")
        np.save(matrix_cache_file, embeddings)
        with open(video_cache_file, "w", encoding="utf-8") as f:
            json.dump({
                "video_id": video_id,
                "title": title,
                "chunks": aggregated_chunks
            }, f, ensure_ascii=False)

        return {
            "video_id": video_id,
            "title": title,
            "chunks_count": len(aggregated_chunks),
            "message": f"Successfully indexed {len(aggregated_chunks)} semantic chunks!"
        }
