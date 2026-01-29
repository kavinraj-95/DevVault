from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.hashing.merkle_tree import get_merkle_root
from app.services.hashing.digital_signature import sign_data, verify_signature
from app.services.encoding.dna_encoding import dna_encode, dna_decode

router = APIRouter()

class MerkleRequest(BaseModel):
    data: List[str]

class SignRequest(BaseModel):
    data: str
    private_key: str

class VerifyRequest(BaseModel):
    data: str
    signature: str
    public_key: str

class DnaRequest(BaseModel):
    text: str

@router.post("/merkle")
def merkle_route(req: MerkleRequest):
    root = get_merkle_root(req.data)
    return {"root_hash": root}

@router.post("/sign")
def sign_route(req: SignRequest):
    sig = sign_data(req.data, req.private_key)
    return {"signature": sig}

@router.post("/verify")
def verify_route(req: VerifyRequest):
    valid = verify_signature(req.data, req.signature, req.public_key)
    return {"valid": valid}

@router.post("/dna/encode")
def dna_enc(req: DnaRequest):
    return {"encoded": dna_encode(req.text)}

@router.post("/dna/decode")
def dna_dec(req: DnaRequest):
    return {"decoded": dna_decode(req.text)}
