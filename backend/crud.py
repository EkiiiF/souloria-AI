# backend/crud.py
from sqlalchemy.orm import Session
from . import models, schemas

# Fungsi untuk membaca semua artikel dari database
def get_all_articles(db: Session):
    """
    Mengembalikan semua record artikel dari tabel data_artikel.
    """
    return db.query(models.Artikel).all()

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