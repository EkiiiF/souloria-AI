# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Import semua modul yang kita butuhkan dari dalam paket 'backend'
from backend import models, crud, ai_engine, schemas
from backend.database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Souloria API")

# --- CORS Middleware ---
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Selamat datang di Souloria API"}

@app.post("/search")
# Gunakan `schemas.SearchQuery` untuk request body
def search(search_query: schemas.SearchQuery, db: Session = Depends(get_db)):
    query = search_query.query
    if not query:
        raise HTTPException(status_code=400, detail="Query tidak boleh kosong")

    # 1. Ambil semua artikel dari DB menggunakan fungsi dari crud.py
    all_articles = crud.get_all_articles(db=db)
    
    # 2. Cari artikel yang relevan
    relevant_articles = ai_engine.find_relevant_articles(query, all_articles, top_k=3)

    if not relevant_articles:
        ai_response = "Maaf, kami belum menemukan artikel yang sesuai dengan pertanyaan Anda."
        sources = []
    else:
        # 3. Hasilkan jawaban dengan Gemini
        ai_response = ai_engine.generate_ai_response(query, relevant_articles)
        sources = [{"judul": art.judul, "url": art.url, "sumber": art.sumber} for art in relevant_articles]

    return {"response": ai_response, "sources": sources}