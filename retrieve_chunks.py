import requests
import pandas as pd
import numpy as np
import ast


# ==========================================
# 1. CREATE EMBEDDING FOR INCOMING ENQUIRY
# ==========================================

def create_embedding(text):
    r = requests.post(
        "http://localhost:11434/api/embed",
        json={
            "model": "bge-m3",
            "input": [text]
        },
        timeout=300
    )

    if r.status_code != 200:
        print("Ollama Error:")
        print(r.text)
        r.raise_for_status()

    return r.json()["embeddings"][0]


# ==========================================
# 2. COSINE SIMILARITY
# ==========================================

def cosine_similarity(vector1, vector2):
    vector1 = np.array(vector1, dtype=float)
    vector2 = np.array(vector2, dtype=float)

    denominator = np.linalg.norm(vector1) * np.linalg.norm(vector2)

    if denominator == 0:
        return 0.0

    return np.dot(vector1, vector2) / denominator


# ==========================================
# 3. LOAD EXISTING EMBEDDINGS
# ==========================================

df = pd.read_csv("embedded_chunks.csv")

print("Existing chunks:", len(df))


# ==========================================
# 4. CONVERT EMBEDDING COLUMN BACK TO LIST
# ==========================================

df["embedding"] = df["embedding"].apply(
    lambda x: ast.literal_eval(x)
)


# ==========================================
# 5. TAKE INCOMING ENQUIRY
# ==========================================

query = input("\nEnter your enquiry: ").strip()

if not query:
    print("No enquiry entered.")
    exit()


# ==========================================
# 6. CREATE EMBEDDING FOR ENQUIRY
# ==========================================

print("\nCreating enquiry embedding...")

query_embedding = create_embedding(query)

print("Enquiry embedding created!")


# ==========================================
# 7. COMPARE QUERY WITH ALL EXISTING VECTORS
# ==========================================

print("\nComparing with existing embeddings...")

scores = []

for embedding in df["embedding"]:
    score = cosine_similarity(query_embedding, embedding)
    scores.append(score)

df["similarity"] = scores


# ==========================================
# 8. SORT BY SIMILARITY
# ==========================================

top_results = df.sort_values(
    by="similarity",
    ascending=False
).head(5)


# ==========================================
# 9. DISPLAY RELATED RESULTS
# ==========================================

print("\n==========================================")
print("TOP RELATED RESULTS")
print("==========================================")

for rank, (_, row) in enumerate(top_results.iterrows(), start=1):

    print(f"\nResult {rank}")
    print("------------------------------------------")

    print("Chunk ID:", row["chunk_id"])
    print("Title:", row["title"])
    print("Start:", row["start"])
    print("End:", row["end"])
    print("Similarity:", round(row["similarity"], 4))
    print("Text:", row["text"])


print("\n==========================================")
print("Search completed!")
print("==========================================")
