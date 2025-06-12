# backend/ingest_data.py
import chromadb
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session

# Impor modul yang diperlukan dari proyek kita
from backend.database import SessionLocal
from backend import crud

print("Memulai proses ingesti data ke ChromaDB...")

# 1. Inisialisasi model untuk membuat embedding
print("Memuat model Sentence Transformer...")
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# 2. Inisialisasi ChromaDB Client
# Ini akan membuat folder 'chroma_data' untuk menyimpan database di disk
chroma_client = chromadb.PersistentClient(path="chroma_data")

# 3. Buat atau dapatkan "collection" (seperti tabel)
collection_name = "souloria_articles"
print(f"Mengakses collection: {collection_name}")
# Gunakan get_or_create_collection untuk menghindari error jika collection sudah ada
collection = chroma_client.get_or_create_collection(name=collection_name)

# 4. Ambil semua artikel dari database SQL
db: Session = SessionLocal()
print("Mengambil semua artikel dari database SQL...")
all_articles = crud.get_all_articles(db)
db.close()

# 5. Proses dan masukkan setiap artikel ke ChromaDB
print(f"Memulai proses embedding dan ingesti untuk {len(all_articles)} artikel...")
for i, article in enumerate(all_articles):
    if not article.isi_artikel_full or not article.isi_artikel_full.strip():
        print(f"Skipping artikel ID {article.id} karena isi kosong.")
        continue

    # Cek apakah dokumen sudah ada di collection
    existing_doc = collection.get(ids=[str(article.id)])
    if len(existing_doc['ids']) > 0:
        print(f"Dokumen dengan ID {article.id} sudah ada. Melewati...")
        continue

    # Buat embedding
    embedding = model.encode(article.isi_artikel_full).tolist()
    
    # Tambahkan ke ChromaDB
    collection.add(
        embeddings=[embedding],
        documents=[article.isi_artikel_full],  # Chroma memerlukan dokumen teks juga
        metadatas=[{"judul": article.judul, "url": article.url, "sumber": article.sumber}],
        ids=[str(article.id)]  # ID harus string
    )
    print(f"({i+1}/{len(all_articles)}) Berhasil menambahkan artikel ID: {article.id} - Judul: {article.judul}")

print("\nProses ingesti selesai!")