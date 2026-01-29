from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Tuple
from app.services.cryptography.hybrid_encryption import generate_key_pair, encrypt_message, decrypt_message
from app.services.cryptography.threshold_crypto import split_secret, reconstruct_secret

router = APIRouter()

class EncryptRequest(BaseModel):
    message: str
    public_key: str

class DecryptRequest(BaseModel):
    encrypted_data: dict
    private_key: str

class SplitRequest(BaseModel):
    secret: str
    n: int
    k: int

class ReconstructRequest(BaseModel):
    shares: List[Tuple[int, int]]

@router.get("/keys")
def get_keys():
    private, public = generate_key_pair()
    return {"private_key": private, "public_key": public}

@router.post("/encrypt")
def encrypt_route(req: EncryptRequest):
    try:
        data = encrypt_message(req.message, req.public_key)
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/decrypt")
def decrypt_route(req: DecryptRequest):
    try:
        msg = decrypt_message(req.encrypted_data, req.private_key)
        return {"message": msg}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Decryption failed. Invalid Key or Data.")

@router.post("/split")
def split_route(req: SplitRequest):
    if req.n < req.k:
        raise HTTPException(status_code=400, detail="n must be >= k")
    shares = split_secret(req.secret, req.n, req.k)
    return {"shares": shares}

@router.post("/reconstruct")
def reconstruct_route(req: ReconstructRequest):
    secret = reconstruct_secret(req.shares)
    return {"secret": secret}
