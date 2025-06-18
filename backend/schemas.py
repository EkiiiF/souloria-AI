# backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from datetime import datetime

# Schema untuk menerima query dari frontend
class SearchQuery(BaseModel):
    query: str

# Schema dasar untuk sebuah artikel, berisi field yang sama di DB
class ArtikelBase(BaseModel):
    sumber: Optional[str] = None
    judul: str
    kategori: Optional[str] = None
    isi_artikel_full: str

# Schema untuk menampilkan artikel ke user, termasuk id dan url
class Artikel(ArtikelBase):
    id: int
    url: str

    # Pydantic v2: 'from_attributes = True' menggantikan 'orm_mode = True'
    # Ini memungkinkan Pydantic membaca data dari objek SQLAlchemy
    class Config:
        from_attributes = True

# Skema untuk menerima data feedback dari pengguna
class FeedbackCreate(BaseModel):
    query: str
    response: str
    is_helpful: bool

# --- IMPLEMENTASI BARU: Skema untuk Pengguna & Autentikasi ---

class UserBase(BaseModel):
    email: str
    nama_pengguna: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ChatMessage(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True