import google.generativeai as genai
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import chromadb
from sqlalchemy.orm import Session
from backend import crud

# Lazy-load
semantic_model = None
gemini_model = None

# Inisialisasi ChromaDB client global (persistent)
chroma_client = chromadb.PersistentClient(path="chroma_data")
collection = chroma_client.get_collection(name="souloria_articles")

def get_semantic_model():
    global semantic_model
    if semantic_model is None:
        print("Memuat model semantic search... (hanya sekali)")
        semantic_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    return semantic_model

def get_gemini_model():
    global gemini_model
    if gemini_model is None:
        print("Mengkonfigurasi model Gemini AI...")
        load_dotenv()
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        generation_config = {
            "temperature": 0.7,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 2048,
        }
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]
        gemini_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
    return gemini_model

# ✅ REPLACE fungsi find_relevant_articles dengan versi ChromaDB
def find_relevant_articles(query: str, db: Session, top_k=3):
    """
    Mencari artikel paling relevan menggunakan ChromaDB.
    """
    model = get_semantic_model()
    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    article_ids_str = results['ids'][0]
    if not article_ids_str:
        return []

    article_ids = [int(id_str) for id_str in article_ids_str]
    print(f"ChromaDB menemukan ID relevan: {article_ids}")

    relevant_articles = crud.get_articles_by_ids(db=db, article_ids=article_ids)
    return relevant_articles

def generate_ai_response(query: str, relevant_articles: list):
    """
    Menghasilkan jawaban dari Gemini berdasarkan query dan artikel relevan.
    """
    model = get_gemini_model()

    context = "Berikut adalah beberapa artikel terpercaya mengenai kesehatan mental:\n\n"
    for i, article in enumerate(relevant_articles):
        context += f"--- Artikel {i+1}: {article.judul} ---\n"
        context += " ".join(article.isi_artikel_full.split()[:500])
        context += "\n\n"

    prompt = f"""
    Anda adalah Souloria, asisten AI yang empatik dan peduli terhadap kesehatan mental.
    Tugas Anda adalah menjawab pertanyaan pengguna dengan hangat, mendukung, dan berdasarkan informasi dari artikel yang telah disediakan.
    Jangan pernah memberikan diagnosis medis. Selalu sarankan untuk berkonsultasi dengan profesional (psikolog atau psikiater) jika situasinya serius.

    KONTEKS DARI ARTIKEL:
    {context}

    PERTANYAAN PENGGUNA:
    "{query}"

    JAWABAN ANDA (dalam Bahasa Indonesia, dengan nada empatik):
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error saat memanggil Gemini API: {e}")
        return "Maaf, sepertinya ada sedikit kendala di pihak kami. Silakan coba beberapa saat lagi."
