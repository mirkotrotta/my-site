from fastapi import APIRouter
from typing import List
from models.schemas import ResumeEntry

router = APIRouter()

@router.get("/", response_model=List[ResumeEntry])
def get_resume():
    return [
        {
            "id": 1,
            "title": "Senior Developer",
            "company": "Open Source Co",
            "start_date": "2021-01-01",
            "end_date": "2023-05-01",
            "description": "Built open-source tools and APIs.",
            "location": "Remote",
            "role_type": "Full-time",
        },
        {
            "id": 2,
            "title": "Junior Dev",
            "company": "Startup X",
            "start_date": "2019-06-01",
            "end_date": "2020-12-01",
            "description": "Worked on MVP frontend using React.",
            "location": "San Francisco",
            "role_type": "Full-time",
        },
    ]
