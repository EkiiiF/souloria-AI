# from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List

# from backend import models, crud, ai_engine, schemas
# from backend.database import SessionLocal, engine, get_db

# models.Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Souloria API")

# # --- CORS Middleware ---
# origins = [
#     "http://localhost:3000", # Untuk jika nanti berjalan di port default
#     "http://localhost:3001", # Tambahkan ini sesuai port Anda sekarang
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- API Endpoints ---
# @app.get("/")
# def read_root():
#     return {"message": "Selamat datang di Souloria API"}

# @app.post("/search")
# def search(search_query: schemas.SearchQuery, db: Session = Depends(get_db)):
#     query = search_query.query
#     if not query:
#         raise HTTPException(status_code=400, detail="Query tidak boleh kosong")

#     relevant_articles = ai_engine.find_relevant_articles(query=query, db=db, top_k=3)

#     if not relevant_articles:
#         ai_response = "Maaf, kami belum menemukan artikel yang sesuai dengan pertanyaan Anda."
#         sources = []
#     else:
#         ai_response = ai_engine.generate_ai_response(query, relevant_articles)
#         sources = [{"judul": art.judul, "url": art.url, "sumber": art.sumber} for art in relevant_articles]

#     return {"response": ai_response, "sources": sources}

# from fastapi import FastAPI, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List
# from datetime import timedelta
# from fastapi.security import OAuth2PasswordRequestForm

# # Impor semua modul yang dibutuhkan dari paket backend
# from backend import models, crud, ai_engine, schemas, auth, security
# from backend.database import engine, get_db

# import uuid 

# # Membuat semua tabel di database jika belum ada
# models.Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Souloria API")

# # --- CORS Middleware ---
# origins = [
#     "http://localhost:3000",
#     "http://localhost:3001",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- API Endpoints ---

# @app.get("/")
# def read_root():
#     return {"message": "Selamat datang di Souloria API"}

# # --- Endpoint Autentikasi ---

# @app.post("/auth/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
# def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email sudah terdaftar")
#     return crud.create_user(db=db, user=user)


# @app.post("/auth/token", response_model=schemas.Token)
# def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = crud.get_user_by_email(db, email=form_data.username)
#     if not user or not security.verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Email atau password salah",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token = auth.create_access_token(data={"sub": user.email})
#     return {"access_token": access_token, "token_type": "bearer"}

# # --- Endpoint Aplikasi Utama ---
# @app.get("/users/me/", response_model=schemas.User)
# def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
#     return current_user

# # --- Endpoint BARU untuk mengambil riwayat ---
# @app.get("/chat/history", response_model=List[schemas.ChatMessage])
# def get_user_chat_history(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_user)):
#     return crud.get_chat_history_by_user(db=db, user_id=current_user.id)


# @app.post("/search")
# def search(search_query: schemas.SearchQuery, db: Session = Depends(get_db)):
#     query = search_query.query
#     if not query:
#         raise HTTPException(status_code=400, detail="Query tidak boleh kosong")

#     relevant_articles = ai_engine.find_relevant_articles(query=query, db=db, top_k=3)

#     if not relevant_articles:
#         ai_response = "Maaf, kami belum menemukan artikel yang sesuai dengan pertanyaan Anda."
#         sources = []
#     else:
#         ai_response = ai_engine.generate_ai_response(query, relevant_articles)
#         sources = [{"judul": art.judul, "url": art.url, "sumber": art.sumber} for art in relevant_articles]

#     return {"response": ai_response, "sources": sources}


# @app.post("/feedback", status_code=status.HTTP_201_CREATED)
# def receive_feedback(feedback_data: schemas.FeedbackCreate, db: Session = Depends(get_db)):
#     crud.create_feedback_log(db=db, feedback=feedback_data)
#     return {"message": "Thank you for your feedback!"}

# from fastapi import FastAPI, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List, Optional
# from datetime import timedelta
# from fastapi.security import OAuth2PasswordRequestForm
# import uuid

# # Impor semua modul yang dibutuhkan
# from backend import models, crud, ai_engine, schemas, auth, security
# from backend.database import engine, get_db

# models.Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Souloria API")

# # --- CORS Middleware ---
# origins = ["http://localhost:3000", "http://localhost:3001"]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Endpoint Autentikasi & Pengguna ---

# @app.post("/auth/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
# def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email sudah terdaftar")
#     return crud.create_user(db=db, user=user)

# @app.post("/auth/token", response_model=schemas.Token)
# def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = crud.get_user_by_email(db, email=form_data.username)
#     if not user or not security.verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Email atau password salah",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token = auth.create_access_token(data={"sub": user.email})
#     return {"access_token": access_token, "token_type": "bearer"}

# @app.get("/users/me/", response_model=schemas.User)
# def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
#     return current_user

# # --- Endpoint Aplikasi Utama ---

# @app.get("/chat/history", response_model=List[schemas.ChatMessage])
# def get_user_chat_history(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_user)):
#     """Endpoint terproteksi untuk mengambil riwayat chat pengguna yang sedang login."""
#     return crud.get_chat_history_by_user(db=db, user_id=current_user.id)

# @app.post("/search")
# def search(
#     search_query: schemas.SearchQuery, 
#     db: Session = Depends(get_db),
#     current_user: Optional[models.User] = Depends(auth.get_current_active_user_optional)
# ):
#     query = search_query.query
#     if not query:
#         raise HTTPException(status_code=400, detail="Query tidak boleh kosong")
    
#     session_id = str(uuid.uuid4())

#     if current_user:
#         crud.create_chat_message(db, user_id=current_user.id, session_id=session_id, role="user", content=query)

#     relevant_articles = ai_engine.find_relevant_articles(query=query, db=db, top_k=3)

#     if not relevant_articles:
#         ai_response = "Maaf, kami belum menemukan artikel yang sesuai dengan pertanyaan Anda."
#         sources = []
#     else:
#         ai_response = ai_engine.generate_ai_response(query, relevant_articles)
#         sources = [{"judul": art.judul, "url": art.url, "sumber": art.sumber} for art in relevant_articles]

#     if current_user:
#         crud.create_chat_message(db, user_id=current_user.id, session_id=session_id, role="ai", content=ai_response)

#     return {"response": ai_response, "sources": sources}

# @app.post("/feedback", status_code=status.HTTP_201_CREATED)
# def receive_feedback(feedback_data: schemas.FeedbackCreate, db: Session = Depends(get_db)):
#     crud.create_feedback_log(db=db, feedback=feedback_data)
#     return {"message": "Thank you for your feedback!"}

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
import uuid

# Impor semua modul yang dibutuhkan dari paket backend
from backend import models, crud, ai_engine, schemas, auth, security
from backend.database import engine, get_db

# Membuat semua tabel di database jika belum ada
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Souloria API")

# --- CORS Middleware ---
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
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

@app.post("/auth/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return crud.create_user(db=db, user=user)

@app.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@app.get("/chat/history", response_model=List[schemas.ChatMessage])
def get_user_chat_history(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    """Endpoint terproteksi untuk mengambil riwayat chat pengguna yang sedang login."""
    return crud.get_chat_history_by_user(db=db, user_id=current_user.id)

@app.post("/search")
def search(
    search_query: schemas.SearchQuery, 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(auth.get_current_active_user_optional)
):
    query = search_query.query
    if not query:
        raise HTTPException(status_code=400, detail="Query tidak boleh kosong")
    
    session_id = str(uuid.uuid4())

    if current_user:
        crud.create_chat_message(db, user_id=current_user.id, session_id=session_id, role="user", content=query)

    relevant_articles = ai_engine.find_relevant_articles(query=query, db=db, top_k=3)

    if not relevant_articles:
        ai_response = "Maaf, kami belum menemukan artikel yang sesuai dengan pertanyaan Anda."
        sources = []
    else:
        ai_response = ai_engine.generate_ai_response(query, relevant_articles)
        sources = [{"judul": art.judul, "url": art.url, "sumber": art.sumber} for art in relevant_articles]

    if current_user:
        crud.create_chat_message(db, user_id=current_user.id, session_id=session_id, role="ai", content=ai_response)

    return {"response": ai_response, "sources": sources}

@app.post("/feedback", status_code=status.HTTP_201_CREATED)
def receive_feedback(feedback_data: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    crud.create_feedback_log(db=db, feedback=feedback_data)
    return {"message": "Thank you for your feedback!"}