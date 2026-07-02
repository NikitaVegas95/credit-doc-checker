from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import checks

app = FastAPI(title="Льготные кредиты — Mock API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(checks.router, prefix="/api")


@app.get("/health", tags=["infra"])
def health():
    return {"status": "ok"}
