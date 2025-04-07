from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import github, resume
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # update this in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
def health():
    return {"status": "OK"}

# Routers
app.include_router(github.router, prefix="/api/github")
app.include_router(resume.router, prefix="/api/resume")
