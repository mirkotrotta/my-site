from fastapi import APIRouter, Query
import json
import os
from models.schemas import (
    Resume, Profile, ExperienceEntry, 
    EducationEntry, CertificationEntry, Skills, LanguageEntry, ProjectEntry
)
from typing import Optional, Dict, Any

router = APIRouter()

# --- Helper Functions ---

def load_json_file(file_path: str) -> Dict[str, Any]:
    """Load data from a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading JSON file {file_path}: {str(e)}")
        return {}

# --- Data Paths ---
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
EN_RESUME_PATH = os.path.join(DATA_DIR, "resume_en.json")
DE_RESUME_PATH = os.path.join(DATA_DIR, "resume_de.json")

# --- API Routes ---

@router.get("/", response_model=Resume)
def get_resume(lang: Optional[str] = Query("en", description="Language code for the resume (en, de)")):
    # Default to English if specified language is not supported
    language = lang if lang in ["en", "de"] else "en"
    
    # Get the language-specific data
    file_path = DE_RESUME_PATH if language == "de" else EN_RESUME_PATH
    resume_data = load_json_file(file_path)
    
    if not resume_data:
        print(f"Warning: No resume data found for language {language}")
        return Resume(
            profile=Profile(name="", title="", location="", phone="", email="", linkedin="", portfolio="", github="", dob="", pob="", marital_status="", nationality=""),
            professional_profile="",
            professional_experience=[],
            education=[],
            certifications=[],
            skills=Skills(frontend=[], backend=[], database=[], automation=[], tools_systems=[]),
            languages=[],
            projects=[]
        )
    
    # Extract basics data
    basics = resume_data.get("basics", {})
    sections = resume_data.get("sections", {})
    
    # Create the profile
    profile = Profile(
        name=basics.get("name", ""),
        title=basics.get("headline", ""),
        location=basics.get("location", ""),
        phone=basics.get("phone", ""),
        email=basics.get("email", ""),
        linkedin=next((item.get("url", {}).get("href", "") for item in sections.get("profiles", {}).get("items", []) if item.get("network") == "LinkedIn"), ""),
        portfolio=basics.get("url", {}).get("href", ""),
        github=next((item.get("url", {}).get("href", "") for item in sections.get("profiles", {}).get("items", []) if item.get("network") == "GitHub"), ""),
        dob=next((field.get("value", "") for field in basics.get("customFields", []) if field.get("name", "").lower().find("birth") >= 0), ""),
        pob="",  # No place of birth in the data
        marital_status="",  # No marital status in the data
        nationality=next((field.get("value", "") for field in basics.get("customFields", []) if field.get("name", "").lower().find("nationality") >= 0), "")
    )
    
    # Extract the professional profile (summary) - preserve HTML formatting
    professional_profile = sections.get("summary", {}).get("content", "")
    
    # Extract experience entries
    experience_items = sections.get("experience", {}).get("items", [])
    professional_experience = []
    for exp in experience_items:
        if not exp.get("visible", True):
            continue
            
        # Parse the HTML summary to extract bullet points
        summary_html = exp.get("summary", "")
        description_items = []
        
        # Extract text within <li><p>...</p></li> tags
        import re
        li_matches = re.findall(r'<li><p>(.*?)</p></li>', summary_html)
        if li_matches:
            description_items = li_matches
        
        # Extract dates
        date_parts = exp.get("date", "").split("–") if "–" in exp.get("date", "") else [exp.get("date", ""), ""]
        start_date = date_parts[0].strip()
        end_date = date_parts[1].strip() if len(date_parts) > 1 else ""
        
        professional_experience.append(ExperienceEntry(
            company=exp.get("company", ""),
            title=exp.get("position", ""),
            start_date=start_date,
            end_date=end_date,
            description=description_items,
            location=exp.get("location", "")
        ))
    
    # Education entries
    education_items = sections.get("education", {}).get("items", [])
    education = []
    for edu in education_items:
        if not edu.get("visible", True):
            continue
        
        date_parts = edu.get("date", "").split("–") if "–" in edu.get("date", "") else [edu.get("date", "")]
        year = date_parts[-1].strip()
            
        # Extract focus from summary if available
        focus = [edu.get("area", "")] if edu.get("area") else []
        if edu.get("summary"):
            summary_text = edu.get("summary", "").replace("<p>", "").replace("</p>", "")
            if summary_text and summary_text not in focus:
                focus.append(summary_text)
        
        education.append(EducationEntry(
            institution=edu.get("institution", ""),
            degree=edu.get("studyType", ""),
            year=year,
            focus=focus
        ))
    
    # Certification entries
    certification_items = sections.get("certifications", {}).get("items", [])
    certifications = []
    for cert in certification_items:
        if not cert.get("visible", True):
            continue
            
        # Keep HTML formatting in notes
        notes = [cert.get("summary", "")] if cert.get("summary") else None
            
        certifications.append(CertificationEntry(
            name=cert.get("name", ""),
            status=cert.get("date", ""),
            notes=notes
        ))
    
    # Skills - better categorization based on the JSON structure
    skill_items = sections.get("skills", {}).get("items", [])
    
    # Initialize skill categories
    frontend_skills = []
    backend_skills = []
    database_skills = []
    automation_skills = []
    tools_systems_skills = []
    
    # Map skills to categories based on name and keywords
    for skill in skill_items:
        if not skill.get("visible", True):
            continue
            
        skill_name = skill.get("name", "")
        skill_level = skill.get("level", 0)
        keywords = skill.get("keywords", [])
        
        # Create a list containing the skill name and its keywords
        skill_data = [skill_name] + keywords
        
        # Categorize based on skill name and keywords
        if skill_name.lower() in ["react", "next.js", "typescript"] or any(kw.lower() in ["frontend", "ui", "jsx", "components"] for kw in keywords):
            frontend_skills.append(skill_data)
        elif skill_name.lower() in ["python", "fastapi"] or any(kw.lower() in ["backend", "api", "server"] for kw in keywords):
            backend_skills.append(skill_data)
        elif skill_name.lower() in ["azure"] or any(kw.lower() in ["database", "cloud", "deployment"] for kw in keywords):
            database_skills.append(skill_data)
        elif any(kw.lower() in ["ci/cd", "automation", "docker"] for kw in keywords):
            automation_skills.append(skill_data)
        else:
            tools_systems_skills.append(skill_data)
    
    skills = Skills(
        frontend=frontend_skills,
        backend=backend_skills,
        database=database_skills,
        automation=automation_skills,
        tools_systems=tools_systems_skills
    )
    
    # Languages
    language_items = sections.get("languages", {}).get("items", [])
    languages = []
    for lang in language_items:
        if not lang.get("visible", True):
            continue
            
        languages.append(LanguageEntry(
            language=lang.get("name", ""),
            level=lang.get("description", "")
        ))
    
    # Projects
    project_items = sections.get("projects", {}).get("items", [])
    projects = []
    for proj in project_items:
        if not proj.get("visible", True):
            continue
            
        # Keep HTML formatting in the description
        summary = proj.get("summary", "")
        
        projects.append(ProjectEntry(
            name=proj.get("name", ""),
            description=[summary] if summary else [],
            github=proj.get("url", {}).get("href", ""),
            stack=", ".join(proj.get("keywords", []))
        ))
    
    # Return the combined resume data using Pydantic models
    return Resume(
        profile=profile,
        professional_profile=professional_profile,
        professional_experience=professional_experience,
        education=education,
        certifications=certifications,
        skills=skills,
        languages=languages,
        projects=projects
    )
