from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth_routes

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevVault API", description="Secure Code Collaboration Platform")

# CORS
origins = [
    "http://localhost:5173", # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "Welcome to DevVault Secure API"}
