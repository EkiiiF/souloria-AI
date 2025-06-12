from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List

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
def search(search_query: schemas.SearchQuery, db: Session = Depends(get_db)):
    query = search_query.query
    if not query:
        raise HTTPException(status_code=400, detail="Query tidak boleh kosong")

    relevant_articles = ai_engine.find_relevant_articles(query=query, db=db, top_k=3)

    if not relevant_articles:
        ai_response = "Maaf, kami belum menemukan artikel yang sesuai dengan pertanyaan Anda."
        sources = []
    else:
        ai_response = ai_engine.generate_ai_response(query, relevant_articles)
        sources = [{"judul": art.judul, "url": art.url, "sumber": art.sumber} for art in relevant_articles]

    return {"response": ai_response, "sources": sources}
