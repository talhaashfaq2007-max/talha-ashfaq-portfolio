# Talha Ashfaq — Emerald Developer Portfolio

A complete dark, emerald-green, responsive portfolio website built with HTML, CSS, and vanilla JavaScript. Designed for GitHub Pages: **no `npm install`, Node.js, build command, or paid service required** for the portfolio itself.

## What's included

- Modern single-page portfolio with simple anchor navigation: **About, Education, Skills, Projects, Experience, Certification, Contact**.
- Premium matte-black and emerald-green palette (no blue), subtle orbit animation, floating terminal, text typing, ticker, scroll reveals, card hover spotlights, navigation scroll progress, and responsive mobile menu.
- Education: BSCS at Superior University Lahore (2025–2029), current 3rd semester, **CGPA 3.58**, ICS, and matriculation.
- Three project cards with working demonstration pages: **Nova AI**, **AttendX**, and **CareerLens**.
- Three professional experience entries with accurate duration descriptions from the current portfolio.
- An actual PDF + image preview of the **Arfa Karim Technology Incubator Artificial Intelligence** course certificate (2025).
- Downloadable, public-facing updated one-page resume at `assets/Talha-Ashfaq-Resume.pdf`. This public edition omits the precise address and phone number for privacy.
- Contact form prepares an email in the visitor's email program; it does **not** submit or store messages.
- Accessibility considerations: skip link, labeled form fields, keyboard navigation, semantic landmarks, focus indicators, reduced-motion support.

## Directory structure

```
index.html                Main single-page portfolio
style.css                 Main theme / responsive styles
script.js                 Navigation, animations, interactions
about.html                Redirect to index.html#about (old URL support)
projects.html             Redirect to index.html#projects
experience.html           Redirect to index.html#experience
contact.html              Redirect to index.html#contact
assets/
  favicon.svg
  demo.css
  certificate-preview.webp
  Talha-Ashfaq-AI-Certificate.pdf
  Talha-Ashfaq-Resume.pdf
projects/
  nova-ai/index.html      Working rule-based chat demo
  nova-ai/app.js
  career-lens/index.html  Resume skill matching demo
  career-lens/app.js
  career-lens/backend/     Optional PDF-extraction Python API
smart-attendance-system/
  index.html              Working browser-only attendance demo
  app.js
.nojekyll                  GitHub Pages compatibility
```

## Preview on your own computer

1. Extract the ZIP.
2. Open `index.html` in your browser, or for a consistent local preview run this command **inside the extracted folder**:

   ```bash
   python -m http.server 5500
   ```
3. Open **http://127.0.0.1:5500**.
4. You can try Nova AI and AttendX entirely in your browser. CareerLens **paste-text mode** also works without a backend.

## Put this new design on your existing GitHub Pages URL

Existing address: `https://talhaashfaq2007-max.github.io/talha-ashfaq-portfolio/`

The ZIP is a complete replacement package, including project demos. **Do not upload the ZIP as one file to your repository. Extract it first.**

The easiest reliable approach with Git installed:

```bash
git clone https://github.com/talhaashfaq2007-max/talha-ashfaq-portfolio.git
cd talha-ashfaq-portfolio
# Now COPY ALL CONTENTS of the extracted ZIP folder into this repository folder,
# replacing existing matching filenames. Keep the projects/ and assets/ folders.
git add -A
git commit -m "Redesign portfolio with emerald theme and certification"
git push origin main
```

If the original repository is already on your computer, copy all contents of the extracted folder into it, replacing existing files, then `git add -A`, `git commit`, and `git push`. Keep a backup of the old repo first.

The website should be served from the repository's **root `/` folder**. GitHub → repo **Settings → Pages** should point to `Deploy from a branch / main / (root)`.

GitHub Pages publishing may take a short time after pushing. Refresh your live site once GitHub finishes deploying.

## Demo limitations (read before using)

- **Nova AI:** local, predefined rule-based responses. It is not an AI chatbot and does not call LLM APIs. Chat history uses browser `localStorage`.
- **AttendX:** functional browser-only records and CSV reports. Data stays in the browser's `localStorage`. There is no authentication or shared database; **do not use with actual confidential student records**.
- **CareerLens:** keyword-matching educational demo. Paste-text mode works on GitHub Pages. PDF upload requires a local Python FastAPI service. See `projects/career-lens/backend/` and the steps below. The score is **not** an official ATS score and does not predict hiring outcomes.
- **Contact form:** opens the visitor's email app. It cannot send automatically without backend or a third-party form provider.
- All animations are designed to respect `prefers-reduced-motion` system preferences.

### CareerLens PDF upload (optional)

Navigate to `projects/career-lens/backend`, then:

```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

In a **separate terminal** serve the whole portfolio directory using `python -m http.server 5500`, and use the app at `http://127.0.0.1:5500/projects/career-lens/`. PDF extraction is limited to selectable text in PDFs of up to 5 MB / 30 pages; no OCR.

## Customize

All portfolio text is in `index.html`. For styles edit `style.css`. For interaction edit `script.js`. Replace the included resume PDF once your education or employment details change. The certificate image is a derivative preview of the included authentic certificate PDF; keep both file paths in sync if replacing it.

The public-facing site intentionally omits exact residential address and personal phone number. LinkedIn, GitHub, and email links use URLs present in the previous portfolio. No photographs are included because none were provided for this redesign.


### Hero heading animation (updated)

The landing headline now types **TALHA** followed by **ASHFAQ** in a large sci-fi / robotic Orbitron font. The font loads from Google Fonts when online; a strong system-font fallback is included. Visitors requesting reduced motion see the complete name immediately. To adjust the typewriter speed, edit the `typeWord` function in `script.js`.
