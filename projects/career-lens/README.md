# CareerLens local API

In a terminal opened in this folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Open the portfolio over a local static server (for example `python -m http.server 5500` from the portfolio root), then open `projects/career-lens/index.html` through that server. The API listens at `http://127.0.0.1:8000`.

The analyzer extracts selectable PDF text using pypdf and does keyword-based skill matching. Scanned/image-only PDFs are not supported. This is not an official ATS score and is not an AI model.
