# AI ResumeMatch — Python Flask Backend

Final Year Project backend service for **AI ResumeMatch: Smart Resume & Job Description Analyzer**.

## 📌 Architecture Overview
- **Framework**: Python Flask + Flask-CORS
- **NLP & Similarity Engine**: scikit-learn (`TfidfVectorizer`, `cosine_similarity`), NumPy
- **Document Parsing**: PyMuPDF (`fitz`) for PDF and `python-docx` for Word DOCX
- **Database**: SQLite3 (`resumematch.db`) with automatic table initialization
- **Explainability**: Deterministic mathematical cosine similarity, sublinear term frequencies, n-gram extraction (unigrams + bigrams), and category-level skill gap classification.

---

## 🚀 Setup & Local Execution

### 1. Prerequisites
Ensure you have Python 3.9+ installed on your system.

### 2. Create and Activate a Virtual Environment
```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate on Linux/macOS
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Seed Initial Data (Optional)
```bash
python seed_data.py
```

### 5. Start the Flask Server
```bash
python app.py
```
The server will start at: `http://localhost:5000`

---

## 📡 REST API Documentation

### 1. `GET /api/health`
Checks server status and connected NLP/database engines.
- **Response**:
```json
{
  "status": "healthy",
  "service": "AI ResumeMatch Flask API",
  "version": "1.0.0",
  "database": "SQLite connected",
  "nlp_engine": "scikit-learn TF-IDF + Cosine Similarity"
}
```

### 2. `POST /api/analyze`
Executes end-to-end TF-IDF vectorization, cosine similarity computation, skill extraction, ATS readability scoring, and improvement advice.
- **Request Body**:
```json
{
  "resume_text": "Alex Chen Full Stack Engineer React TypeScript Node...",
  "job_description": "We are looking for Full Stack Engineer with React...",
  "resume_title": "Alex Chen Resume",
  "job_title": "Full Stack Engineer"
}
```
- **Response**:
```json
{
  "id": "analysis-a1b2c3d4",
  "timestamp": "2026-10-19 12:00",
  "overall_score": 84,
  "cosine_similarity": 82.5,
  "skill_match_score": 88.0,
  "matched_skills": [...],
  "missing_skills": [...],
  "category_gaps": [...],
  "top_term_weights": [...]
}
```

### 3. `POST /api/parse-resume`
Extracts raw text from uploaded `.pdf`, `.docx`, or `.txt` files using PyMuPDF and python-docx.
- **Form Data**: `file` (multipart file upload)

### 4. `POST /api/ats-check`
Performs standalone or job-aligned Applicant Tracking System (ATS) compatibility check.
- **Request Body**:
```json
{
  "resume_text": "Full text of resume...",
  "job_description": "Optional target job requisition text...",
  "missing_skills": ["AWS", "Docker"]
}
```
- **Response**:
```json
{
  "ats_compatibility_report": {
    "atsScore": 88,
    "contactDetails": { "emailFound": true, "phoneFound": true, "linkedinFound": true },
    "sectionsDetected": [...],
    "checks": [...],
    "recommendations": [...]
  }
}
```

### 5. `GET /api/history`
Returns historical comparison records stored in SQLite.

### 6. `GET /api/history/<id>`
Retrieves a specific stored analysis record.

### 7. `DELETE /api/history/<id>`
Deletes an analysis record.

---

## 🔍 ATS Check Verification Taxonomy & Limitations

| Check Category | Implementation Method | Verification Level | Technical Note |
| :--- | :--- | :--- | :--- |
| **Email & Phone Presence** | Regex pattern matching | **Verified** | Deterministic check for email and international/E.164 phone formats. |
| **LinkedIn / Portfolio URL** | Domain and handle regex | **Verified** | Identifies custom LinkedIn URLs and developer portfolio handles. |
| **Standard Headings** | Alias dictionary & line length | **Verified** | Recognizes Skills, Experience, Education, Projects, and Certifications. |
| **Student Work History Tolerance** | Academic/Project presence logic | **Verified** | Does NOT penalize students for lacking work experience if Projects/Education exist. |
| **Text Stream Fragmentation** | Single-word line ratio heuristic | **Approximate** | Flags potential multi-column reading order corruption. |
| **Decorative Bullet Glyphs** | UTF-8 non-standard symbol scan | **Verified** | Detects geometric wingdings (❖, ★, ▲) that confuse legacy ATS parsers. |
| **Visual 2D Text Boxes & Canvas Columns** | Stream parser limitation | **Unverified** | Plain text extraction discards X/Y coordinates; cannot verify visual column bounding boxes without 2D OCR. |
| **Images Containing Text** | Stream parser limitation | **Unverified** | Flattened raster images cannot be parsed without optical character recognition (OCR). |

