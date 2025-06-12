# backend/ai_engine.py
import google.generativeai as genai
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util
import torch

# Variabel global untuk lazy loading
semantic_model = None
gemini_model = None

def get_semantic_model():
    """
    Lazy-load model SentenceTransformer hanya saat dibutuhkan.
    """
    global semantic_model
    if semantic_model is None:
        print("Memuat model semantic search... (hanya sekali)")
        semantic_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    return semantic_model

def get_gemini_model():
    """
    Lazy-load konfigurasi dan model Gemini hanya saat dibutuhkan.
    """
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
            # Tambahkan threshold lain sesuai kebutuhan
        ]
        gemini_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
    return gemini_model

def find_relevant_articles(query: str, articles: list, top_k=3):
    """
    Mencari artikel paling relevan menggunakan vector similarity.
    """
    if not articles:
        return []

    model = get_semantic_model()

    corpus = [article.isi_artikel_full for article in articles]
    corpus_embeddings = model.encode(corpus, convert_to_tensor=True)
    query_embedding = model.encode(query, convert_to_tensor=True)

    cos_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]
    top_results = torch.topk(cos_scores, k=min(top_k, len(corpus)))

    relevant_articles = []
    for score, idx in zip(top_results[0], top_results[1]):
        relevant_articles.append(articles[int(idx)])
        print(f"Artikel: {articles[int(idx)].judul}, Skor: {score:.4f}")

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
