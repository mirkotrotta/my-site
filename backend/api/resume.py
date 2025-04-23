from fastapi import APIRouter
from models.schemas import (
    Resume, Profile, ExperienceEntry, AdditionalExperienceEntry,
    EducationEntry, CertificationEntry, Skills, LanguageEntry, ProjectEntry
)

router = APIRouter()

@router.get("/", response_model=Resume)
def get_resume():
    return Resume(
        profile=Profile(
            name="Mirko Trotta",
            location="Hanau, Germany",
            phone="+49 0173 9405570",
            email="mirkotrottac@gmail.com",
            linkedin="https://www.linkedin.com/in/mirkotrotta",
            portfolio="https://www.mirkotrotta.com/",
            github="https://github.com/mirkotrotta",
            dob="07 October 1981",
            pob="Caracas, Venezuela",
            marital_status="Married",
            nationality="Italian",
        ),
        professional_profile="Full stack developer with a backend and automation focus, experienced in building APIs, internal tools, and cloud-ready workflows. Combines hands-on technical skills with a background in creative production and cross-functional delivery. Skilled in Python, FastAPI, React, Docker, and cloud platforms like Azure. Self-taught, reliable, and effective in distributed teams.",
        professional_experience=[
            ExperienceEntry(
                company="Santana Consulting",
                title="Full Stack Developer",
                start_date="Oct 2024",
                end_date="Present",
                description=[
                    "Developed membership funnels and platform integrations for fitness clients such as UFC Gym and Redfit.",
                    "Delivered API integrations, internal tools, and UI system enhancements.",
                    "Supported low-code product delivery using Webflow and Figma."
                ],
                location="Aschaffenburg, Germany"
            ),
            ExperienceEntry(
                company="Freelance",
                title="**Independent Technology Consultant**",
                start_date="2023",
                end_date="Present",
                description=[
                    "Developed 'Moon Site' (Next.js) for frontend skills.",
                    "Built automation tool (Python, FastAPI, Slack API) for backend and integration.",
                    "Explored development setups and AI agent concepts.",
                ],
                location="Hanau, Germany"
            ),
            ExperienceEntry(
                company="Artus Interactive",
                title="Art Director (Digital & Motion)",
                start_date="Jul 2022",
                end_date="Sep 2023",
                description=[
                    "Designed UI components and campaign visuals for Braun and Gillette eCommerce platforms",
                    "Led digital creative execution with a focus on motion design and consistent brand delivery"
                ],
                location="Frankfurt am Main, Germany"
            ),
            ExperienceEntry(
                company="Fitvia GmbH",
                title="Art Director / Team Lead (Creative)",
                start_date="Jan 2022",
                end_date="Jun 2022",
                description=[
                    "Led a small creative team delivering packaging, branding, and eCommerce content",
                    "Coordinated internal and external teams across campaign production",
                    "Contract ended due to company-wide restructuring"
                ],
                location="Wiesbaden, Germany"
            ),
            ExperienceEntry(
                company="Cocomore AG",
                title="Content Manager / Art Director Motion",
                start_date="Jan 2019",
                end_date="Jun 2022",
                description=[
                    "Managed content in Sitecore CMS for international brands like Pampers and Nestlé",
                    "Promoted to Art Director role for digital content, campaigns, and automation tooling",
                    "Produced visuals and UI components for Nespresso, Fairy, Oral-B, and others"
                ],
                location="Frankfurt am Main, Germany"
            ),
            ExperienceEntry(
                company="Pantomima Studio",
                title="Founder / Web & Branding Consultant",
                start_date="2011",
                end_date="2018",
                description=[
                    "Built a creative full-service agency focused on web development, branding, and digital strategy",
                    "Delivered WordPress websites using HTML, CSS, JavaScript, and WooCommerce",
                    "Supported international small business clients with end-to-end solutions"
                ],
                location="Caracas, Venezuela"
            ),
        ],
        additional_experience=[
            AdditionalExperienceEntry(
                company="",
                title="",
                years="2008 – 2011",
                description=[
                    "Visual designer for Amazon and eBay product listings (Vendotronic, Remote, USA)",
                    "TV production assistant and show producer (Venevisión, Venezuela)",
                    "Technical editor (internship, HBO Latin America, Venezuela)",
                    "Post-production and video editing (Telecaribe, Venezuela)"
                ]
            ),
        ],
        education=[
            EducationEntry(
                institution="Universidad Santa María – Caracas, Venezuela",
                degree="Media Studies (non-degree)",
                year="2007",
                focus=None
            ),
            EducationEntry(
                institution="UE Lino de Clemente – Caracas, Venezuela",
                degree="High School Diploma",
                year="1999",
                focus=None
            ),
        ],
        certifications=[
            CertificationEntry(
                name="Microsoft AZ-900 – Azure Fundamentals",
                status="in progress",
                notes=None
            ),
            CertificationEntry(
                name="Planned: AZ-104 or AZ-400 for Cloud & DevOps",
                status="planned",
                notes=None
            ),
            CertificationEntry(
                name="Self-directed study: Docker, GitHub Actions, Bicep, CrewAI, LangChain, OpenAI API",
                status="self-directed",
                notes=None
            ),
        ],
        skills=Skills(
            frontend_development=[
                ["React", "Next.js", "TypeScript", "Tailwind CSS", "Responsive UI Design"]
            ],
            backend_systems=[
                ["Python", "FastAPI", "Pydantic", "REST APIs", "Docker"] 
            ],
            databases_devops=[
                ["PostgreSQL", "SQLite", "GitHub Actions", "CI/CD Pipelines", "Azure"] 
            ],
            automation_ai=[
                ["OpenAI API", "LangChain", "CrewAI", "MCP Agents", "Automation Design"]
            ],
            developer_environments_tooling=[
                ["Linux", "Git", "GitHub", "WSL", "Agile Frameworks"]
            ]
        ),
        languages=[
            LanguageEntry(language="Spanish", level="Native"),
            LanguageEntry(language="English", level="Fluent (C1)"),
            LanguageEntry(language="German", level="Advanced (B2)"),
            LanguageEntry(language="Italian", level="Basic (A2)"),
        ],
        projects=[
            ProjectEntry(
                name="Moon Site",
                description=[
                    "Full Stack Portfolio Boilerplate",
                    "Stack: Next.js 14, Tailwind CSS, MDX, FastAPI, Docker"
                ],
                github="https://github.com/mirkotrotta/moon-site",
                stack="Next.js 14, Tailwind CSS, MDX, FastAPI, Docker"
            ),
            # ...add all other projects as lists...
        ]
    )
