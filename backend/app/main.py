from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth_routes, code_routes, crypto_routes, utils_routes

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
app.include_router(code_routes.router, prefix="/api/code", tags=["Code Repository"])
app.include_router(crypto_routes.router, prefix="/api/crypto", tags=["Cryptography"])
app.include_router(utils_routes.router, prefix="/api/utils", tags=["Utils"])

@app.get("/")
def read_root():
    return {"message": "Welcome to DevVault Secure API"}
