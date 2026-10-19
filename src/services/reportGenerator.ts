import { AnalysisResult } from '../types';

/**
 * Generates an exhaustive, formal Markdown report containing all academic and
 * industry compliance criteria required for the Final Year Project evaluation.
 */
export function generateMarkdownReport(analysis: AnalysisResult): string {
  const report = analysis.atsCompatibilityReport;
  const atsScore = report ? report.atsScore : analysis.atsReadabilityScore;

  // Extract checks that resulted in warnings or failures for formatting risks section
  const warningChecks = report?.checks.filter(c => c.status === 'warning' || c.status === 'fail') || [];
  const unverifiedChecks = report?.checks.filter(c => c.verificationLevel === 'unverified') || [];

  return `# AI ResumeMatch — Comprehensive Analysis & ATS Compatibility Report
**Academic Final Year Project (FYP) Evaluation & Candidate Diagnostic**

---

### 1. Document Overview & Metadata
- **Project Name:** AI ResumeMatch — Smart Resume & Job Description Analyzer
- **Generated Timestamp:** ${analysis.timestamp}
- **Document ID:** \`${analysis.id}\`
- **Candidate Resume:** ${analysis.resumeTitle}
- **Target Position:** ${analysis.jobTitle} ${analysis.companyName ? `(${analysis.companyName})` : ''}
- **Resume Length:** ${analysis.wordCountResume} words
- **Job Description Length:** ${analysis.wordCountJD} words
- **Analysis Engine:** Local scikit-learn TF-IDF + Cosine Similarity (Deterministic & Zero External APIs)

---

### 2. Evaluated Metrics Summary
| Metric | Score | Evaluation Rubric |
| :--- | :--- | :--- |
| **Overall Composite Score** | **${analysis.overallScore} / 100** | Weighted combination: 40% TF-IDF Cosine + 35% Skill Coverage + 15% ATS Parsability + 10% Keyword Density. |
| **TF-IDF Cosine Similarity** | **${analysis.cosineSimilarity}%** | Mathematical angle between L2-normalized term frequency vectors in Euclidean space. |
| **Skill Match Rate** | **${analysis.skillMatchScore}%** | Found ${analysis.matchedSkills.length} of ${analysis.matchedSkills.length + analysis.missingSkills.length} requested technical & domain competencies. |
| **ATS Compatibility Score** | **${atsScore} / 100** | Algorithmic audit of text extractability, contact discoverability, section standard headers, and layout safety. |

> **IMPORTANT DISCLAIMER & NOTICE:**
> The textual similarity score and ATS compatibility score measure vocabulary overlap and document structure. Neither metric represents an employer's official proprietary ATS vendor score (e.g., Workday, Taleo, Greenhouse, iCIMS) nor guarantees selection for an interview. These scores provide explainable educational feedback for candidate optimization.

---

### 3. Mathematical Explanation of the Similarity Score
- **Vector Space Model (VSM):** The resume and job requisition are converted into high-dimensional vector representations where each dimension corresponds to a distinct n-gram (unigrams and bigrams).
- **Sublinear Term Frequency Scaling:**
  $$\\text{tf}(t, d) = 1 + \\ln(\\text{count}(t, d)) \\quad \\text{for } \\text{count} > 0$$
  Sublinear scaling ensures that repeating a keyword multiple times provides diminishing mathematical benefit, preventing artificial keyword stuffing.
- **Smooth Inverse Document Frequency:**
  $$\\text{idf}(t) = \\ln\\left(\\frac{1 + N}{1 + \\text{df}(t)}\\right) + 1$$
  Differentiates specialized technical competencies from generic stop words and boilerplate language.
- **L2 Euclidean Normalization:**
  $$v_{\\text{norm}} = \\frac{v}{\\|v\\|_2} = \\frac{v}{\\sqrt{\\sum v_i^2}}$$
  Normalizes for document length discrepancies, ensuring long resumes do not score higher purely due to length.
- **Cosine Similarity:**
  $$\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2}$$
  Calculates the cosine of the angle between normalized vectors in high-dimensional space, yielding a score between 0% (orthogonal vectors / no common terminology) and 100% (identical term distributions).

---

### 4. ATS Compatibility Scoring Methodology
The ATS Compatibility Score ($${atsScore}/100$$) is calculated through four diagnostic pillars:
1. **Contact Information Discoverability (Max 20 pts):** Verified regex extraction of candidate email address, telephone number, location, and professional links (LinkedIn / GitHub).
2. **Section Hierarchy & Standard Headings (Max 30 pts):** Deterministic scanning for conventional headings: Summary, Skills, Work Experience, Education, Projects, and Certifications.
   - *Student Protection Clause:* If a student or entry-level candidate lacks corporate work experience but documents strong Projects and Education, the system recognizes "Alternative Present" and awards full points without penalizing the candidate.
3. **Formatting Safety & Parsability (Max 25 pts):** Scans for plain text extractability, line length integrity, bullet density, and non-standard unicode characters.
4. **Job Keyword & Competency Alignment (Max 25 pts):** Verifies that high-frequency job description requirements appear natively within the resume's text stream.

---

### 5. Contact Details & Section Hierarchy Audit
${report ? `
#### Contact Discoverability:
- **Email Detected:** ${report.contactDetails.emailFound ? `✅ Verified (\`${report.contactDetails.emailAddress}\`)` : '❌ MISSING (Severe ATS Risk)'}
- **Phone Detected:** ${report.contactDetails.phoneFound ? `✅ Verified (\`${report.contactDetails.phoneNumber}\`)` : '❌ MISSING (Severe ATS Risk)'}
- **LinkedIn / Portfolio:** ${report.contactDetails.linkedinFound ? `✅ Detected (\`${report.contactDetails.linkedinUrl || 'Found'}\`)` : 'ℹ️ Optional (Recommended for technical roles)'}
- **Geographic Location:** ${report.contactDetails.locationFound ? '✅ City / State / Country detected' : 'ℹ️ Not explicitly identified'}

#### Standard Headings Audit (Student Protection Active):
| Section Name | Status | Evaluation |
| :--- | :--- | :--- |
${report.sectionsDetected.map(s => `| **${s.sectionName}** | ${s.status === 'present' ? '✅ Detected' : s.status === 'alternative_present' ? '🛡️ Alternative Present' : '⚠️ Missing / Non-Standard'} | ${s.explanation} |`).join('\n')}
` : '- Standard structural heuristics applied.'}

---

### 6. Formatting Risks & Parsing Warnings
${report ? `
#### Detected Formatting Factors:
- **Character Encoding Integrity:** ${report.formattingRisks.hasSpecialCharacters ? '⚠️ Non-standard Unicode / icon glyphs detected. May cause character corruption in older ATS parsers.' : '✅ Clean ASCII / UTF-8 text formatting.'}
- **Bullet Point Density:** ${report.formattingRisks.excessiveBulletPoints ? '⚠️ High bullet point density detected without sufficient narrative context.' : '✅ Well-balanced bullet point structure.'}
- **Line Length & Fragmentation:** ${report.formattingRisks.lineLengthIssues ? '⚠️ Extremely long unpunctuated lines detected, which can indicate multi-column table overflow.' : '✅ Standard sentence and paragraph lengths.'}
- **Unusual Section Headings:** ${report.formattingRisks.unusualSectionHeadings.length > 0 ? `⚠️ Found non-standard headers: ${report.formattingRisks.unusualSectionHeadings.join(', ')}. Use standard industry headers.` : '✅ All detected headings follow standard naming.'}

#### Specific Warnings & Checks Requiring Attention:
${warningChecks.length > 0 ? warningChecks.map(w => `- **[${w.status.toUpperCase()}] ${w.title}:** ${w.message} *(Recommendation: ${w.recommendation || 'Review section format'}*)`).join('\n') : '- No critical formatting warnings identified.'}

#### Verified vs. Unverified ATS Elements:
- **Verified Deterministically:** Text character extraction (${report.textExtractionStatus.wordCount} words), email syntax, phone regex, exact keyword occurrences.
- **Approximate Heuristics:** Section header synonyms and reading-order continuity.
- **Unverified Visual Constraints:** ${report.formattingRisks.unverifiedLayoutNotice}
` : '- Formatting risks assessed via standard heuristics.'}

---

### 7. Technical & Domain Skill Alignment
#### Matched Competencies (${analysis.matchedSkills.length}):
${analysis.matchedSkills.length > 0 
  ? analysis.matchedSkills.map(s => `- **${s.name}** (${s.category}) — Mentioned in job requisition (${s.frequencyInJD}x)`).join('\n') 
  : '- No direct skills matched.'}

#### Missing Skill Gaps (${analysis.missingSkills.length}):
${analysis.missingSkills.length > 0 
  ? analysis.missingSkills.map(s => `- **${s.name}** [${s.importance.toUpperCase()}] (${s.category}) — Requisition requires this (${s.frequencyInJD}x)`).join('\n') 
  : '- All required job competencies are present in the resume.'}

#### 7-Domain Category Gap Breakdown:
| Domain Category | Requisition Total | Candidate Matched | Gaps | Match Rate |
| :--- | :--- | :--- | :--- | :--- |
${analysis.categoryGaps.map(g => `| **${g.category}** | ${g.totalRequired} | ${g.matchedCount} | ${g.missingCount} | ${g.matchPercentage}% |`).join('\n')}

---

### 8. Highest-Weighted TF-IDF Keywords
These represent the most statistically significant terms distinguishing the job requisition and resume text:

| Term / Keyword | Resume L2 Weight | Job L2 Weight | Taxonomy Classification |
| :--- | :--- | :--- | :--- |
${analysis.topTermWeights.slice(0, 15).map(t => `| **${t.term}** | ${t.resumeWeight.toFixed(4)} | ${t.jobWeight.toFixed(4)} | ${t.isSkill ? '🏷️ Technical Skill' : '📄 Context Keyword'} |`).join('\n')}

---

### 9. Prioritized Actionable Recommendations
${analysis.recommendations.map(r => `#### [${r.type.toUpperCase()}] ${r.title}
- **Target Resume Section:** ${r.targetSection}
- **Context & Observation:** ${r.description}
- **Recommended Action:** ${r.suggestedAction}
`).join('\n')}

---

### 10. Technical Limitations of the Analysis
1. **Plain Text Stream Limitations:** Standard stream extractors (e.g. PyMuPDF text streams, pdf.js) discard graphical 2D bounding boxes. Floating text boxes, multi-column tables, and headers/footers may be extracted out of reading order.
2. **Scanned Images & Graphic Text:** Resumes generated as flattened image PDFs or containing text embedded inside graphic shapes cannot be parsed without Optical Character Recognition (OCR).
3. **Proprietary Commercial Parsing Discrepancies:** Commercial ATS platforms (Workday, Taleo, iCIMS, Greenhouse) utilize varying proprietary parsing algorithms. A high score on this diagnostic tool indicates high compliance with general parsing best practices, not an absolute vendor pass guarantee.
4. **Non-Invention Rule:** Improvement recommendations must only be acted upon if the candidate genuinely possesses the referenced competencies. Candidates must never fabricate qualifications or engage in invisible keyword stuffing.

---
*Report generated by **AI ResumeMatch** — Explainable Natural Language Processing FYP Platform.*  
*Verification: Deterministic scikit-learn TF-IDF & Cosine Similarity Engine.*
`;
}

/**
 * Generates an executive, print-ready, beautifully styled HTML report
 * suitable for printing to PDF or saving locally.
 */
export function generateHtmlReport(analysis: AnalysisResult): string {
  const report = analysis.atsCompatibilityReport;
  const atsScore = report ? report.atsScore : analysis.atsReadabilityScore;

  const warningChecks = report?.checks.filter(c => c.status === 'warning' || c.status === 'fail') || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI ResumeMatch Report — ${analysis.resumeTitle}</title>
  <style>
    :root {
      --primary: #0F172A;
      --indigo: #4F46E5;
      --indigo-light: #EEF2FF;
      --emerald: #059669;
      --emerald-light: #ECFDF5;
      --amber: #D97706;
      --amber-light: #FFFBEB;
      --rose: #DC2626;
      --rose-light: #FEF2F2;
      --slate-50: #F8FAFC;
      --slate-100: #F1F5F9;
      --slate-200: #E2E8F0;
      --slate-500: #64748B;
      --slate-700: #334155;
      --slate-900: #0F172A;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: var(--slate-900);
      background: #FFFFFF;
      padding: 40px 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .header-bar {
      border-bottom: 2px solid var(--slate-200);
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    .project-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--indigo);
      background: var(--indigo-light);
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
    }
    h1 { font-size: 22px; font-weight: 800; color: var(--primary); letter-spacing: -0.02em; }
    .meta-text { font-size: 12px; color: var(--slate-500); margin-top: 4px; }
    .print-actions { display: flex; gap: 8px; }
    .btn {
      font-size: 12px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: #1E293B; }
    .btn-secondary { background: var(--slate-100); color: var(--slate-700); border-color: var(--slate-200); }
    .btn-secondary:hover { background: var(--slate-200); }
    
    .disclaimer-box {
      background: var(--amber-light);
      border: 1px solid #FCD34D;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 24px;
      font-size: 11.5px;
      color: #92400E;
      line-height: 1.45;
    }
    .disclaimer-box strong { color: #78350F; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    .kpi-card {
      border: 1px solid var(--slate-200);
      background: var(--slate-50);
      border-radius: 8px;
      padding: 14px;
      text-align: center;
    }
    .kpi-val {
      font-size: 26px;
      font-weight: 800;
      font-family: monospace;
      color: var(--indigo);
      letter-spacing: -0.02em;
    }
    .kpi-val.emerald { color: var(--emerald); }
    .kpi-lbl {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--slate-500);
      margin-top: 2px;
    }

    h2 {
      font-size: 15px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1.5px solid var(--slate-200);
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 12px;
    }
    h3 { font-size: 13px; font-weight: 700; color: var(--slate-700); margin: 12px 0 6px 0; }
    p, li { font-size: 12px; color: var(--slate-700); line-height: 1.5; }
    ul { padding-left: 18px; margin-bottom: 10px; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 8px;
      margin-bottom: 16px;
    }
    th, td {
      border: 1px solid var(--slate-200);
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: var(--slate-100);
      color: var(--slate-700);
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    td.mono { font-family: monospace; font-size: 11.5px; }

    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .badge-pass { background: var(--emerald-light); color: var(--emerald); }
    .badge-warn { background: var(--amber-light); color: var(--amber); }
    .badge-fail { background: var(--rose-light); color: var(--rose); }
    .badge-info { background: var(--indigo-light); color: var(--indigo); }

    .formula-box {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      padding: 12px;
      font-size: 11.5px;
      font-family: monospace;
      color: var(--slate-700);
      margin: 8px 0 16px 0;
      line-height: 1.4;
    }

    .rec-box {
      border: 1px solid var(--slate-200);
      background: var(--slate-50);
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
    }
    .rec-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .rec-title { font-weight: 700; font-size: 12px; color: var(--slate-900); }
    .rec-action {
      margin-top: 6px;
      color: var(--indigo);
      font-weight: 600;
      font-size: 11.5px;
    }

    .footer {
      margin-top: 40px;
      border-top: 1px solid var(--slate-200);
      padding-top: 16px;
      font-size: 11px;
      color: var(--slate-500);
      text-align: center;
    }

    @media print {
      body { padding: 0; max-width: 100%; }
      .no-print { display: none !important; }
      .kpi-card { border: 1px solid #CCC; }
      table, th, td { border: 1px solid #CCC; }
      h2 { page-break-after: avoid; }
      .rec-box { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="no-print header-bar" style="border-bottom: none; margin-bottom: 10px;">
    <div>
      <span class="project-badge">BS Computer Science FYP Deliverable</span>
    </div>
    <div class="print-actions">
      <button onclick="window.print()" class="btn btn-primary">
        🖨️ Print / Save as PDF
      </button>
    </div>
  </div>

  <div class="header-bar">
    <div>
      <h1>AI ResumeMatch — Formal Analysis & ATS Audit Report</h1>
      <div class="meta-text">
        Generated On: <strong>${analysis.timestamp}</strong> &bull; Record ID: <code>${analysis.id}</code><br>
        Candidate: <strong>${analysis.resumeTitle}</strong> &bull; Target Role: <strong>${analysis.jobTitle}</strong> ${analysis.companyName ? `(${analysis.companyName})` : ''}
      </div>
    </div>
  </div>

  <div class="disclaimer-box">
    <strong>Academic & Regulatory Notice:</strong> The textual similarity score and ATS compatibility score measure vocabulary overlap, keyword frequency, and document parsability. Neither score guarantees an employment offer or reflects a specific employer's proprietary ATS screening configuration. All NLP processing is computed deterministically without external generative AI APIs.
  </div>

  <h2>1. Primary Evaluation Scores</h2>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-val">${analysis.overallScore}%</div>
      <div class="kpi-lbl">Composite Match</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${analysis.cosineSimilarity}%</div>
      <div class="kpi-lbl">Cosine Similarity</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${analysis.skillMatchScore}%</div>
      <div class="kpi-lbl">Skill Coverage</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val emerald">${atsScore}%</div>
      <div class="kpi-lbl">ATS Compatibility</div>
    </div>
  </div>

  <h2>2. Similarity Score & NLP Methodology</h2>
  <p>The resume and job requisition are evaluated using a <strong>Vector Space Model (VSM)</strong> implemented with scikit-learn mathematical formulations:</p>
  <div class="formula-box">
    1. Sublinear Term Frequency : tf(t, d) = 1 + ln(count(t, d))  (dampens keyword repetition)<br>
    2. Smooth Inverse Doc Freq : idf(t) = ln((1 + N) / (1 + df(t))) + 1<br>
    3. L2 Euclidean Normalization: ||v||₂ = sqrt(sum(v_i²))<br>
    4. Cosine Similarity Angle : cos(θ) = (u · v) / (||u||₂ · ||v||₂)
  </div>
  <p>This isolates authentic domain vocabulary overlap and prevents artificial keyword stuffing.</p>

  <h2>3. ATS Compatibility & Contact Details Audit</h2>
  <table>
    <thead>
      <tr><th>Evaluation Item</th><th>Status</th><th>Detected Value / Audit Notes</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Email Address</strong></td>
        <td><span class="badge ${report?.contactDetails.emailFound ? 'badge-pass' : 'badge-fail'}">${report?.contactDetails.emailFound ? 'PASS' : 'FAIL'}</span></td>
        <td class="mono">${report?.contactDetails.emailAddress || 'No valid email syntax discovered. High ATS rejection risk.'}</td>
      </tr>
      <tr>
        <td><strong>Telephone Number</strong></td>
        <td><span class="badge ${report?.contactDetails.phoneFound ? 'badge-pass' : 'badge-fail'}">${report?.contactDetails.phoneFound ? 'PASS' : 'FAIL'}</span></td>
        <td class="mono">${report?.contactDetails.phoneNumber || 'No phone number format detected.'}</td>
      </tr>
      <tr>
        <td><strong>LinkedIn / Portfolio</strong></td>
        <td><span class="badge ${report?.contactDetails.linkedinFound ? 'badge-pass' : 'badge-info'}">${report?.contactDetails.linkedinFound ? 'DETECTED' : 'OPTIONAL'}</span></td>
        <td>${report?.contactDetails.linkedinUrl || 'Not detected (recommended for technical engineering positions)'}</td>
      </tr>
      <tr>
        <td><strong>Location Details</strong></td>
        <td><span class="badge ${report?.contactDetails.locationFound ? 'badge-pass' : 'badge-info'}">${report?.contactDetails.locationFound ? 'DETECTED' : 'NOT FOUND'}</span></td>
        <td>Standard geographic location indicator.</td>
      </tr>
    </tbody>
  </table>

  <h3>Standard Section Headings (Student Protection Enabled)</h3>
  <table>
    <thead>
      <tr><th>Section Name</th><th>Status</th><th>Notes & Academic Protection</th></tr>
    </thead>
    <tbody>
      ${(report?.sectionsDetected || []).map(s => `
        <tr>
          <td><strong>${s.sectionName}</strong></td>
          <td>
            <span class="badge ${s.status === 'present' ? 'badge-pass' : s.status === 'alternative_present' ? 'badge-info' : 'badge-warn'}">
              ${s.status === 'present' ? 'PRESENT' : s.status === 'alternative_present' ? 'PROTECTED' : 'MISSING'}
            </span>
          </td>
          <td>${s.explanation}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>4. Formatting Risks & Parsing Warnings</h2>
  <table>
    <thead>
      <tr><th>Check Area</th><th>Status</th><th>Observation & ATS Impact</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Special Unicode Glyphs</strong></td>
        <td><span class="badge ${report?.formattingRisks.hasSpecialCharacters ? 'badge-warn' : 'badge-pass'}">${report?.formattingRisks.hasSpecialCharacters ? 'WARNING' : 'PASS'}</span></td>
        <td>${report?.formattingRisks.hasSpecialCharacters ? 'Decorative icons or unusual unicode characters detected. May become garbled in older ATS parsers.' : 'Standard UTF-8 character encoding confirmed.'}</td>
      </tr>
      <tr>
        <td><strong>Bullet Density</strong></td>
        <td><span class="badge ${report?.formattingRisks.excessiveBulletPoints ? 'badge-warn' : 'badge-pass'}">${report?.formattingRisks.excessiveBulletPoints ? 'WARNING' : 'PASS'}</span></td>
        <td>${report?.formattingRisks.excessiveBulletPoints ? 'High bullet density without narrative paragraphs.' : 'Balanced bullet point structure.'}</td>
      </tr>
      <tr>
        <td><strong>Line Length & Fragmentation</strong></td>
        <td><span class="badge ${report?.formattingRisks.lineLengthIssues ? 'badge-warn' : 'badge-pass'}">${report?.formattingRisks.lineLengthIssues ? 'WARNING' : 'PASS'}</span></td>
        <td>${report?.formattingRisks.lineLengthIssues ? 'Long unpunctuated lines found, indicating possible multi-column table text overflow.' : 'Clean sentence-boundary distribution.'}</td>
      </tr>
    </tbody>
  </table>

  ${warningChecks.length > 0 ? `
    <h3>Actionable Audit Warnings</h3>
    <ul>
      ${warningChecks.map(w => `<li><strong>${w.title}:</strong> ${w.message} ${w.recommendation ? `<em>(Action: ${w.recommendation})</em>` : ''}</li>`).join('')}
    </ul>
  ` : ''}

  <h2>5. Technical & Domain Skill Alignment</h2>
  <p style="margin-bottom: 8px;">Breakdown of competencies identified against our curated 7-domain skill dictionary:</p>
  <table>
    <thead>
      <tr><th>Skill Competency</th><th>Category</th><th>Importance</th><th>Found in Resume?</th></tr>
    </thead>
    <tbody>
      ${analysis.matchedSkills.map(s => `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td>${s.category}</td>
          <td>${s.importance}</td>
          <td><span class="badge badge-pass">MATCH (${s.frequencyInJD}x in JD)</span></td>
        </tr>
      `).join('')}
      ${analysis.missingSkills.map(s => `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td>${s.category}</td>
          <td>${s.importance}</td>
          <td><span class="badge badge-fail">MISSING (${s.frequencyInJD}x in JD)</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>6. High-Impact Requisition Keywords</h2>
  <table>
    <thead>
      <tr><th>Term / Keyword</th><th>Resume L2 Weight</th><th>Job L2 Weight</th><th>Taxonomy Classification</th></tr>
    </thead>
    <tbody>
      ${analysis.topTermWeights.slice(0, 12).map(t => `
        <tr>
          <td><strong>${t.term}</strong></td>
          <td class="mono">${t.resumeWeight.toFixed(4)}</td>
          <td class="mono">${t.jobWeight.toFixed(4)}</td>
          <td><span class="badge ${t.isSkill ? 'badge-info' : 'badge-pass'}">${t.isSkill ? 'Technical Skill' : 'Requisition Keyword'}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>7. Prioritized Actionable Recommendations</h2>
  ${analysis.recommendations.map(r => `
    <div class="rec-box">
      <div class="rec-header">
        <span class="rec-title">[${r.type.toUpperCase()}] ${r.title}</span>
        <span class="badge badge-info">Target: ${r.targetSection}</span>
      </div>
      <div>${r.description}</div>
      <div class="rec-action">&rarr; Recommended Fix: ${r.suggestedAction}</div>
    </div>
  `).join('')}

  <h2>8. System Limitations & Verification Boundaries</h2>
  <ul>
    <li><strong>Verified Automatically:</strong> Plain text stream tokenization, email/phone regex patterns, UTF-8 byte validation, and dictionary skill matches.</li>
    <li><strong>Approximate Heuristics:</strong> Reading order continuity and section header synonyms.</li>
    <li><strong>Unverified Visual Constraints:</strong> ${report?.formattingRisks.unverifiedLayoutNotice || 'Floating text frames, visual 2D tables, and image-based text cannot be verified without OCR.'}</li>
  </ul>

  <div class="footer">
    AI ResumeMatch &bull; BS Computer Science Final Year Project &bull; Explainable Local NLP Engine
  </div>
</body>
</html>`;
}

/**
 * Triggers browser download of the Markdown report file.
 */
export function downloadMarkdownReport(analysis: AnalysisResult) {
  const content = generateMarkdownReport(analysis);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI_ResumeMatch_Report_${analysis.id}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Triggers browser download of the self-contained HTML/PDF-ready report.
 */
export function downloadHtmlReport(analysis: AnalysisResult) {
  const content = generateHtmlReport(analysis);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI_ResumeMatch_Report_${analysis.id}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Triggers browser download of complete JSON data.
 */
export function downloadJsonReport(analysis: AnalysisResult) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `AI_ResumeMatch_Data_${analysis.id}.json`;
  a.click();
}

/**
 * Opens a print-ready window with the formatted HTML report and triggers print.
 */
export function openPrintReport(analysis: AnalysisResult) {
  const html = generateHtmlReport(analysis);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  }
}
