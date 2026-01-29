from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "Developer"

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class MFAVerify(BaseModel):
    username: str
    token: str

class MFASetupResponse(BaseModel):
    uri: str
    qr_code: str
    secret: str
