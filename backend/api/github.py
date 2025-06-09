from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
import httpx
import os
from dotenv import load_dotenv
import logging

router = APIRouter()

# Initialize rate limiter for this router
limiter = Limiter(key_func=get_remote_address)

load_dotenv()

GITHUB_API_URL = "https://api.github.com/user/repos"
GITHUB_TOKEN = os.getenv("GH_BACKEND_TOKEN")

# Get logger
logger = logging.getLogger(__name__)

# Register both routes (with and without trailing slash)
@router.get("")
@router.get("/")
@limiter.limit("20/minute")
async def get_projects(request: Request):
    # Check if token is available
    if not GITHUB_TOKEN:
        logger.warning("Missing GITHUB_TOKEN in environment, returning fallback data")
        # Return fallback projects data if no token is available
        return [
            {
                "name": "moon-site",
                "description": "Full Stack Portfolio Boilerplate",
                "url": "https://github.com/mirkotrotta/moon-site",
                "stars": 0,
                "updated": "2023-12-01T12:00:00Z",
                "language": "TypeScript",
                "topics": ["showcase", "nextjs", "fastapi", "portfolio"]
            },
            {
                "name": "automation-tool",
                "description": "Slack-integrated automation system using Python and FastAPI",
                "url": "https://github.com/mirkotrotta/automation-tool",
                "stars": 0,
                "updated": "2023-11-15T10:30:00Z",
                "language": "Python", 
                "topics": ["showcase", "automation", "fastapi", "slackapi"]
            }
        ]

    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.mercy-preview+json"  # for 'topics'
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(GITHUB_API_URL, headers=headers, timeout=10)
            response.raise_for_status()
        data = response.json()

        projects = [
            {
                "name": repo["name"],
                "description": repo["description"],
                "url": repo["html_url"],
                "stars": repo["stargazers_count"],
                "updated": repo["pushed_at"],
                "language": repo["language"],
                "topics": repo.get("topics", [])
            }
            for repo in data
            if not repo["private"]
            and repo.get("description")
            and "showcase" in repo.get("topics", [])
        ]

        return projects

    except Exception as e:
        logger.error(f"GitHub API error: {str(e)}")
        # Return fallback data in case of any error
        return [
            {
                "name": "moon-site",
                "description": "Full Stack Portfolio Boilerplate",
                "url": "https://github.com/mirkotrotta/moon-site",
                "stars": 0,
                "updated": "2023-12-01T12:00:00Z",
                "language": "TypeScript",
                "topics": ["showcase", "nextjs", "fastapi", "portfolio"]
            },
            {
                "name": "automation-tool",
                "description": "Slack-integrated automation system using Python and FastAPI",
                "url": "https://github.com/mirkotrotta/automation-tool",
                "stars": 0,
                "updated": "2023-11-15T10:30:00Z",
                "language": "Python", 
                "topics": ["showcase", "automation", "fastapi", "slackapi"]
            }
        ]
