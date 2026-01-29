from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.code_repository import CodeRepository
from app.models.user import User
from app.services.authentication.jwt_handler import verify_token
from app.services.authorization.bell_lapadula import can_read, can_write
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class RepoCreate(BaseModel):
    name: str
    description: str
    classification: str
    content: str

class RepoResponse(BaseModel):
    id: int
    name: str
    description: str
    classification: str
    owner: str
    content: str
    can_read: bool
    can_write: bool

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token, HTTPException(status_code=401, detail="Invalid token"))
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/", response_model=RepoResponse)
def create_repo(repo: RepoCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Create is a "Write". User can only create objects at their level or higher?
    # Usually users create objects at their own level.
    # Strict BLP: Write Up allowed.
    if not can_write(user.clearance_level, repo.classification):
         raise HTTPException(status_code=403, detail="Security Violation: No Write Down (You cannot create a document with lower classification than your clearance)")

    new_repo = CodeRepository(
        name=repo.name,
        description=repo.description,
        classification=repo.classification,
        content=repo.content,
        owner_id=user.id
    )
    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)
    
    return {
        "id": new_repo.id,
        "name": new_repo.name,
        "description": new_repo.description,
        "classification": new_repo.classification,
        "owner": user.username,
        "content": new_repo.content,
        "can_read": True,
        "can_write": True
    }

@router.get("/")
def list_repos(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repos = db.query(CodeRepository).all()
    results = []
    
    # We list all, but content might be hidden or flags set
    for repo in repos:
        c_read = can_read(user.clearance_level, repo.classification)
        c_write = can_write(user.clearance_level, repo.classification)
        
        results.append({
            "id": repo.id,
            "name": repo.name,
            "description": repo.description,
            "classification": repo.classification,
            "owner_id": repo.owner_id,
            "can_read": c_read,
            "can_write": c_write,
            "content": repo.content if c_read else "[REDACTED: INSUFFICIENT CLEARANCE]"
        })
    return results
