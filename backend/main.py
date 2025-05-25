from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import github, resume
from dotenv import load_dotenv
load_dotenv()

# Disable automatic redirect for trailing slashes to prevent 307 redirects
app = FastAPI(redirect_slashes=False)

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

# Test endpoint
@app.get("/api/test")
def test():
    return {"message": "API test endpoint is working"}

# Routers
app.include_router(github.router, prefix="/api/github")
app.include_router(resume.router, prefix="/api/resume")
