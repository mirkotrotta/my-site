from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from api import github, resume
from dotenv import load_dotenv
load_dotenv()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Disable automatic redirect for trailing slashes to prevent 307 redirects
app = FastAPI(redirect_slashes=False)

# Add rate limiter to app state
app.state.limiter = limiter

# Add rate limit exceeded exception handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    response = JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "detail": f"Rate limit exceeded: {exc.detail}"
        }
    )
    response = _rate_limit_exceeded_handler(request, exc)
    return response

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Add HSTS and other security headers
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    
    return response

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # update this in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check - exempted from rate limiting
@app.get("/health")
@limiter.exempt
def health():
    return {"status": "ok"}

# Test endpoint with rate limiting
@app.get("/api/test")
@limiter.limit("20/minute")
def test(request: Request):
    return {"message": "API test endpoint is working"}

# Routers
app.include_router(github.router, prefix="/api/github")
app.include_router(resume.router, prefix="/api/resume")
