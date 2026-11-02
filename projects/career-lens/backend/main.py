"""Local CareerLens demo backend. This is *keyword matching*, not AI or ATS scoring."""
import io
import re
from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

app = FastAPI(title="CareerLens local prototype", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=[
    "http://127.0.0.1:5500", "http://localhost:5500",
    "http://127.0.0.1:8000", "http://localhost:8000",
    # GitHub Pages preview can reach a locally running API on supported browsers.
    "https://talhaashfaq2007-max.github.io",
], allow_credentials=False, allow_methods=["POST"], allow_headers=["*"])

TERMS = {
    "Python": r"\bpython\b", "C++": r"\bc\+\+(?=\W|$)|\bcpp\b", "JavaScript": r"\bjavascript\b|\bjs\b",
    "HTML": r"\bhtml5?\b", "CSS": r"\bcss3?\b", "React": r"\breact(?:\.js)?\b",
    "Node.js": r"\bnode(?:\.js)?\b", "SQL": r"\bsql\b", "PostgreSQL": r"\bpostgres(?:ql)?\b",
    "MongoDB": r"\bmongodb\b", "FastAPI": r"\bfastapi\b", "Django": r"\bdjango\b",
    "Flask": r"\bflask\b", "Git": r"\bgit\b", "GitHub": r"\bgithub\b",
    "Linux": r"\blinux\b", "Docker": r"\bdocker\b", "REST API": r"\brest(?:ful)?\s*api\b|\bapis?\b",
    "Machine Learning": r"\bmachine learning\b", "Artificial Intelligence": r"\bartificial intelligence\b|\bai\b",
    "Data Analysis": r"\bdata analysis\b|\bpandas\b", "NumPy": r"\bnumpy\b",
    "Problem Solving": r"\bproblem solving\b", "Communication": r"\bcommunication\b",
    "Teamwork": r"\bteamwork\b|\bteam collaboration\b", "Microsoft Excel": r"\bexcel\b",
    "AWS": r"\baws\b|\bamazon web services\b", "Azure": r"\bazure\b", "Cybersecurity": r"\bcybersecurity\b",
}

@app.post("/analyze")
async def analyze(resume: UploadFile = File(...), description: str = Form(...)):
    if not description.strip() or len(description) > 20_000:
        raise HTTPException(400, "Enter a job description (max 20,000 characters).")
    if not (resume.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Choose a PDF file.")
    raw = await resume.read(5 * 1024 * 1024 + 1)
    if len(raw) > 5 * 1024 * 1024:
        raise HTTPException(400, "PDF must be 5 MB or smaller.")
    try:
        pdf = PdfReader(io.BytesIO(raw), strict=False)
        if len(pdf.pages) > 30:
            raise HTTPException(400, "PDF is too long (30 page limit).")
        text = " ".join((page.extract_text() or "") for page in pdf.pages)[:25000]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(400, "PDF could not be read. Use a selectable-text PDF.")
    if not text.strip():
        raise HTTPException(400, "No selectable text found; scanned/image-only PDFs are not supported.")
    required = [name for name, pattern in TERMS.items() if re.search(pattern, description, re.I)]
    matched = [name for name in required if re.search(TERMS[name], text, re.I)]
    missing = [name for name in required if name not in matched]
    score = round(len(matched) / len(required) * 100) if required else 0
    # Do not persist uploaded resumes or their contents.
    return {"required": required, "matched": matched, "missing": missing, "score": score}
