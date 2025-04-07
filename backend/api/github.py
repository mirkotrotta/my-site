from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()

GITHUB_API_URL = "https://api.github.com/user/repos"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

if not GITHUB_TOKEN:
    raise RuntimeError("Missing GITHUB_TOKEN in environment")

@router.get("/")
async def get_projects():
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
        raise HTTPException(status_code=500, detail=str(e))
