from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas import UserCreate, UserLogin, Token, MFAVerify, MFASetupResponse
from app.services.authentication.password_auth import get_password_hash, verify_password
from app.services.authentication.jwt_handler import create_access_token
from app.services.authentication.mfa_service import generate_mfa_secret, get_totp_uri, generate_qr_code_base64, verify_totp

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.username, "role": new_user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
def login(user: UserLogin, mfa_token: str = None, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if db_user.mfa_enabled:
        if not mfa_token:
            raise HTTPException(status_code=403, detail="MFA token required")
        if not verify_totp(db_user.mfa_secret, mfa_token):
             raise HTTPException(status_code=401, detail="Invalid MFA token")

    access_token = create_access_token(data={"sub": db_user.username, "role": db_user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/mfa/setup", response_model=MFASetupResponse)
def setup_mfa(username: str, db: Session = Depends(get_db)):
    # In real app, verify current user via token. For simplicity passing username.
    # TODO: Add dependency for current user
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    secret = generate_mfa_secret()
    uri = get_totp_uri(secret, user.username)
    qr = generate_qr_code_base64(uri)
    
    # Don't save secret yet, save on verify? Or save now but not enabled.
    user.mfa_secret = secret
    db.commit()
    
    return {"secret": secret, "uri": uri, "qr_code": qr}

@router.post("/mfa/enable")
def enable_mfa(data: MFAVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_totp(user.mfa_secret, data.token):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    user.mfa_enabled = True
    db.commit()
    return {"message": "MFA enabled successfully"}
