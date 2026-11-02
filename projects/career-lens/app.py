import re
from io import BytesIO
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

app = FastAPI(title="CareerLens API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["POST", "GET"], allow_headers=["*"])
MAX_FILE_SIZE = 5 * 1024 * 1024
SKILLS = {
    "Python": ["python"], "C++": ["c++", "cpp"], "Java": ["java"],
    "JavaScript": ["javascript"], "TypeScript": ["typescript"], "HTML": ["html"],
    "CSS": ["css"], "React": ["react", "reactjs"], "Node.js": ["node.js", "nodejs"],
    "FastAPI": ["fastapi"], "Django": ["django"], "Flask": ["flask"],
    "SQL": ["sql"], "MySQL": ["mysql"], "PostgreSQL": ["postgresql", "postgres"],
    "SQLite": ["sqlite"], "MongoDB": ["mongodb"], "REST APIs": ["rest api", "rest apis", "restful api"],
    "Git": ["git"], "GitHub": ["github"], "Docker": ["docker"], "Linux": ["linux"],
    "Pandas": ["pandas"], "NumPy": ["numpy"], "Data Analysis": ["data analysis"],
    "Machine Learning": ["machine learning"], "Deep Learning": ["deep learning"],
    "NLP": ["natural language processing", "nlp"], "Computer Vision": ["computer vision"],
    "TensorFlow": ["tensorflow"], "PyTorch": ["pytorch"], "Generative AI": ["generative ai", "gen ai"],
    "Large Language Models": ["large language model", "large language models", "llms"],
    "LangChain": ["langchain"], "Prompt Engineering": ["prompt engineering"],
    "Communication": ["communication"], "Teamwork": ["teamwork", "team collaboration"],
    "Problem Solving": ["problem solving"], "Analytical Thinking": ["analytical thinking"],
    "Microsoft Excel": ["microsoft excel", "excel"], "Power BI": ["power bi"],
}

def normalize(text: str) -> str:
    return " " + re.sub(r"\s+", " ", re.sub(r"[^a-z0-9+#.]+", " ", text.lower())).strip() + " "

def extract_skills(text: str) -> list[str]:
    normalized = normalize(text)
    found = []
    for name, aliases in SKILLS.items():
        if any((" " + re.sub(r"\s+", " ", re.sub(r"[^a-z0-9+#.]+", " ", a.lower())).strip() + " ") in normalized for a in aliases):
            found.append(name)
    return found

def extract_pdf(data: bytes) -> str:
    try:
        reader = PdfReader(BytesIO(data), strict=False)
        if reader.is_encrypted:
            raise HTTPException(422, "Password-protected PDFs are not supported.")
        if not reader.pages or len(reader.pages) > 30:
            raise HTTPException(422, "PDF must contain between 1 and 30 pages.")
        text = " ".join((page.extract_text() or "") for page in reader.pages)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) < 50:
            raise HTTPException(422, "Not enough selectable text found. Scanned/image-only PDFs are not supported.")
        return text
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(422, "Could not read the PDF. Please try another file.") from exc

@app.get("/")
def home():
    return {"application": "CareerLens API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze(resume: UploadFile = File(...), job_description: str = Form(...)):
    if not resume.filename or not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Upload a PDF resume.")
    job_description = job_description.strip()
    if len(job_description) < 30 or len(job_description) > 20000:
        raise HTTPException(400, "Job description must be between 30 and 20,000 characters.")
    data = await resume.read(MAX_FILE_SIZE + 1)
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(413, "PDF must not exceed 5 MB.")
    if not data.startswith(b"%PDF-"):
        raise HTTPException(400, "The file does not appear to be a valid PDF.")
    text = extract_pdf(data)
    resume_skills = extract_skills(text)
    required = extract_skills(job_description)
    matched = [skill for skill in required if skill in resume_skills]
    missing = [skill for skill in required if skill not in resume_skills]
    score = round(len(matched) / len(required) * 100) if required else 0
    words = len(re.findall(r"\b\w+\b", text))
    recommendations = []
    if not required:
        recommendations.append("No supported skills were identified in the job description. Add explicit technology and skill requirements.")
    elif missing:
        recommendations.append("If you genuinely have experience with these skills, consider highlighting them: " + ", ".join(missing[:8]) + ".")
    if matched:
        recommendations.append("Bring relevant projects and evidence for these matched skills forward: " + ", ".join(matched[:8]) + ".")
    if words < 150:
        recommendations.append("The extracted resume text is relatively short. Check whether the PDF contains all sections and selectable text.")
    recommendations.append("Use job-related keywords naturally and only when they accurately describe your experience.")
    return {"score": score, "matched_skills": matched, "missing_skills": missing, "required_skills": required, "word_count": words, "recommendations": recommendations, "analysis_method": "Rule-based keyword matching"}
