# backend/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
from dotenv import load_dotenv

# Impor dari file proyek Anda
from . import crud, models, schemas, security
from .database import get_db

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_secret_key_jika_tidak_ditemukan")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # Token berlaku 24 jam

# Skema untuk endpoint yang WAJIB login (error jika tidak ada token)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# Skema BARU untuk endpoint yang OPSIONAL login (tidak error jika tidak ada token)
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Penjaga gerbang yang MEWAJIBKAN login
def get_current_active_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user

# Penjaga gerbang BARU yang OPSIONAL
def get_current_active_user_optional(token: Optional[str] = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    if token is None:
        # Jika tidak ada token (pengguna tamu), kembalikan None
        return None
    
    # Jika ada token, lakukan validasi seperti biasa
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None # Token tidak valid, anggap sebagai tamu
        token_data = schemas.TokenData(email=email)
    except JWTError:
        return None # Token tidak valid, anggap sebagai tamu
    
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None or not user.is_active:
        return None # Pengguna tidak ditemukan atau tidak aktif, anggap sebagai tamu
    
    return user