import json
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi


# ==========================================
# 1. GET YOUTUBE URL
# ==========================================

url = input("Paste YouTube URL: ").strip()

if not url:
    print("No URL entered.")
    exit()


# ==========================================
# 2. EXTRACT VIDEO ID
# ==========================================

parsed_url = urlparse(url)

if "youtube.com" in parsed_url.netloc:
    video_id = parse_qs(parsed_url.query).get("v", [None])[0]

elif "youtu.be" in parsed_url.netloc:
    video_id = parsed_url.path.strip("/")

else:
    video_id = None


if not video_id:
    print("Invalid YouTube URL.")
    exit()


print("\nVideo ID:", video_id)


# ==========================================
# 3. GET TRANSCRIPT
# ==========================================

print("\nGetting transcript...")

api = YouTubeTranscriptApi()

try:
    transcript = api.fetch(video_id)

except Exception as e:
    print("\nCould not get transcript.")
    print("Error:", e)
    exit()


print("Transcript received!")


# ==========================================
# 4. GET VIDEO TITLE
# ==========================================

# We don't need yt-dlp for this.
# Use the video ID as the title for now.
#
# If you want the actual YouTube title later,
# we can add that separately.

title = "YouTube Video"


# ==========================================
# 5. CREATE CHUNKS
# ==========================================

chunks = []
all_text = []

for i, item in enumerate(transcript, start=1):

    start = item.start
    end = item.start + item.duration
    text = item.text.strip()

    if not text:
        continue

    chunks.append({
        "number": str(i),
        "title": title,
        "start": round(start, 2),
        "end": round(end, 2),
        "text": text
    })

    all_text.append(text)


# ==========================================
# 6. COMPLETE TEXT
# ==========================================

whole_text = " ".join(all_text)


# ==========================================
# 7. CREATE FINAL JSON
# ==========================================

data = {
    "chunks": chunks,
    "whole_text": whole_text
}


# ==========================================
# 8. SAVE JSON
# ==========================================

with open("chunks.json", "w", encoding="utf-8") as f:

    json.dump(
        data,
        f,
        ensure_ascii=False,
        indent=4
    )


# ==========================================
# 9. RESULT
# ==========================================

print("\n===================================")
print("chunks.json created successfully!")
print("===================================")

print("Total chunks:", len(chunks))

print("\nFirst 3 chunks:\n")

for chunk in chunks[:3]:

    print(chunk)