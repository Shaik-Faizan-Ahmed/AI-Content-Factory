import chromadb

client=chromadb.PersistentClient(path="./chroma")

collection=client.get_or_create_collection(
    name="test_collection"
)

with open("research.txt","r",encoding="utf-8") as f:
    text=f.read()

collection.add(
    documents=[text],
    ids=["doc1"]
)

results=collection.query(
    query_texts=["What is a black hole?"],
    n_results=1
)

print(results)