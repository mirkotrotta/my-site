from pydantic import BaseModel
from typing import Optional
from datetime import date

class ResumeEntry(BaseModel):
    id: int
    title: str
    company: str
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None
    location: Optional[str] = None
    role_type: Optional[str] = None
