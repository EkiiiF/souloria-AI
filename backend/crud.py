# backend/crud.py
from sqlalchemy.orm import Session
from typing import List

# Impor security untuk hashing password
from . import models, schemas, security

# --- Fungsi untuk Artikel ---
def get_all_articles(db: Session):
    return db.query(models.Artikel).all()

def get_articles_by_ids(db: Session, article_ids: List[int]):
    return db.query(models.Artikel).filter(models.Artikel.id.in_(article_ids)).all()

# --- Fungsi untuk Feedback ---
def create_feedback_log(db: Session, feedback: schemas.FeedbackCreate):
    db_feedback = models.FeedbackLog(
        query_text=feedback.query,
        response_text=feedback.response,
        is_helpful=feedback.is_helpful
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

# --- Fungsi Baru untuk Pengguna (User) ---
def get_user_by_email(db: Session, email: str):
    """Mencari pengguna berdasarkan alamat email."""
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Membuat pengguna baru dan melakukan hashing pada password."""
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        nama_pengguna=user.nama_pengguna,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# --- Fungsi BARU untuk Riwayat Chat ---
def create_chat_message(db: Session, user_id: int, session_id: str, role: str, content: str):
    db_message = models.ChatHistory(
        user_id=user_id,
        session_id=session_id,
        role=role,
        content=content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_chat_history_by_user(db: Session, user_id: int):
    return db.query(models.ChatHistory).filter(models.ChatHistory.user_id == user_id).order_by(models.ChatHistory.created_at.asc()).all()