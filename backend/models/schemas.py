from pydantic import BaseModel
from typing import List, Optional

class Profile(BaseModel):
    name: str
    location: str
    phone: str
    email: str
    linkedin: str
    portfolio: str
    github: str
    dob: str
    pob: str
    marital_status: str
    nationality: str

class ExperienceEntry(BaseModel):
    company: str
    title: str
    start_date: str
    end_date: Optional[str]
    description: List[str]
    location: str

class AdditionalExperienceEntry(BaseModel):
    company: str
    title: str
    years: str
    description: Optional[List[str]]

class EducationEntry(BaseModel):
    institution: str
    degree: str
    year: str
    focus: Optional[List[str]]

class CertificationEntry(BaseModel):
    name: str
    status: str
    notes: Optional[List[str]]

class Skills(BaseModel):
    technologies: List[List[str]]
    automation_ai: List[List[str]]
    tools_systems: List[List[str]]

class LanguageEntry(BaseModel):
    language: str
    level: str

class ProjectEntry(BaseModel):
    name: str
    description: List[str]
    github: str
    stack: str

class Resume(BaseModel):
    profile: Profile
    professional_profile: str
    professional_experience: List[ExperienceEntry]
    additional_experience: List[AdditionalExperienceEntry]
    education: List[EducationEntry]
    certifications: List[CertificationEntry]
    skills: Skills
    languages: List[LanguageEntry]
    projects: List[ProjectEntry]
