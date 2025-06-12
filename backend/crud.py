# backend/crud.py
from sqlalchemy.orm import Session
from . import models

# Fungsi untuk membaca semua artikel dari database
def get_all_articles(db: Session):
    """
    Mengembalikan semua record artikel dari tabel data_artikel.
    """
    return db.query(models.Artikel).all()

# Nanti kita bisa tambahkan fungsi lain di sini, misalnya:
# def get_artikel_by_id(db: Session, artikel_id: int):
#     return db.query(models.Artikel).filter(models.Artikel.id == artikel_id).first()
#
# def create_feedback(...):
#     ...