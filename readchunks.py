import requests
import json
import pandas as pd
import time


def create_embedding(text_list):
    r = requests.post(
        "http://localhost:11434/api/embed",
        json={
            "model": "bge-m3",
            "input": text_list
        },
        timeout=300
    )

    if r.status_code != 200:
        print("Ollama Error:")
        print(r.text)
        r.raise_for_status()

    return r.json()["embeddings"]


# Load chunks.json
with open("chunks.json", "r", encoding="utf-8") as f:
    content = json.load(f)

chunks = content["chunks"]

print("Number of chunks:", len(chunks))

# Remove empty chunks
valid_chunks = [
    chunk for chunk in chunks
    if chunk.get("text", "").strip()
]

print("Valid chunks:", len(valid_chunks))


# --------------------------------
# Create embeddings in batches
# --------------------------------

BATCH_SIZE = 5

my_dicts = []

for start in range(0, len(valid_chunks), BATCH_SIZE):

    batch = valid_chunks[start:start + BATCH_SIZE]

    texts = [chunk["text"] for chunk in batch]

    print(
        f"\nCreating embeddings "
        f"{start + 1} - {start + len(batch)} "
        f"of {len(valid_chunks)}"
    )

    embeddings = create_embedding(texts)

    for i, chunk in enumerate(batch):

        chunk["chunk_id"] = start + i
        chunk["embedding"] = embeddings[i]

        my_dicts.append(chunk)

    print("Batch completed!")

    # Small pause between batches
    time.sleep(1)


# --------------------------------
# Create DataFrame
# --------------------------------

df = pd.DataFrame(my_dicts)

print("\nEmbeddings created successfully!")
print(df.head())

# Save
df.to_csv("embedded_chunks.csv", index=False)

print("\nSaved as embedded_chunks.csv")