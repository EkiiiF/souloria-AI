# backend/models.py
from sqlalchemy import Column, Integer, String, Text, Date
from backend.database import Base
from sqlalchemy import Column, Integer, Text, Boolean, DateTime, func

class Artikel(Base):
    __tablename__ = "data_artikel"

    id = Column(Integer, primary_key=True, index=True)
    sumber = Column(String(255))
    judul = Column(String(255))
    url = Column(String(255), unique=True)
    tanggal = Column(Date)
    kategori = Column(String(100))
    reviewed_by = Column(String(100))
    isi_artikel = Column(Text)
    isi_artikel_cleaning = Column(Text)
    isi_artikel_tokenized = Column(Text)
    isi_artikel_filtered = Column(Text)
    isi_artikel_stemmed = Column(Text)
    isi_artikel_full = Column(Text) # Kita akan fokus pada kolom ini untuk konten

class FeedbackLog(Base):
    __tablename__ = "feedback_log"

    id = Column(Integer, primary_key=True, index=True)
    query_text = Column(Text, nullable=False)
    response_text = Column(Text, nullable=False)
    is_helpful = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())