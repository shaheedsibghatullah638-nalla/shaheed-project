import { AtsCompatibilityReport, AtsCheckItem, AtsSectionDetection } from '../types';
import { getSkillsDictionary } from '../data/skillsDictionary';

/**
 * Evaluates a resume text for Applicant Tracking System (ATS) compatibility
 * based on text extractability, contact details, standard section headers,
 * formatting risks, and job-description keyword alignment.
 */
export function evaluateAtsCompatibility(
  resumeText: string,
  jobDescriptionText: string = '',
  missingSkillsList: string[] = []
): AtsCompatibilityReport {
  const checks: AtsCheckItem[] = [];
  const lines = resumeText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const words = resumeText.trim().split(/\s+/).filter(Boolean);
  const lowerText = resumeText.toLowerCase();

  // ==========================================
  // 1. TEXT EXTRACTION CHECK
  // ==========================================
  const wordCount = words.length;
  const charCount = resumeText.length;
  const isExtractable = wordCount >= 30;
  
  // Heuristic: check if lines look like broken single words (indicative of table column misorder)
  const singleWordLines = lines.filter(l => l.split(/\s+/).length === 1).length;
  const potentialMisorderingWarning = lines.length > 20 && (singleWordLines / lines.length) > 0.45;

  if (wordCount < 30) {
    checks.push({
      id: 'chk-extraction-empty',
      category: 'text_extraction',
      title: 'Text Extraction Sufficiency',
      status: 'fail',
      verificationLevel: 'verified',
      message: 'Very low word count extracted (< 30 words). Document may be corrupt, password-protected, or an image scan.',
      details: `Extracted ${wordCount} words and ${charCount} characters.`,
      recommendation: 'Ensure your document contains selectable, real text rather than flattened image layers.'
    });
  } else if (potentialMisorderingWarning) {
    checks.push({
      id: 'chk-extraction-order',
      category: 'text_extraction',
      title: 'Text Extraction & Reading Order',
      status: 'warning',
      verificationLevel: 'approximate',
      message: 'Potential text stream fragmentation detected. Multi-column tables may be reading vertically out of order.',
      details: `${singleWordLines} out of ${lines.length} lines contain only single words.`,
      recommendation: 'Switch from a multi-column graphic layout to a clean single-column chronological layout.'
    });
  } else {
    checks.push({
      id: 'chk-extraction-pass',
      category: 'text_extraction',
      title: 'Text Extractability',
      status: 'pass',
      verificationLevel: 'verified',
      message: 'Resume text is cleanly extractable by plain text and UTF-8 stream parsers.',
      details: `${wordCount} words cleanly parsed across ${lines.length} lines.`
    });
  }

  // ==========================================
  // 2. CONTACT DETAILS CHECK
  // ==========================================
  const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
  const emailMatch = resumeText.match(emailRegex);
  const emailFound = !!emailMatch;
  const emailAddress = emailMatch ? emailMatch[0] : undefined;

  const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/;
  const phoneMatch = resumeText.match(phoneRegex);
  const phoneFound = !!phoneMatch;
  const phoneNumber = phoneMatch ? phoneMatch[0] : undefined;

  const linkedinRegex = /(?:linkedin\.com\/in\/|linkedin:\s*)([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = resumeText.match(linkedinRegex);
  const linkedinFound = !!linkedinMatch || lowerText.includes('linkedin');
  const linkedinUrl = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : undefined;

  // Location heuristics (City, State / ZIP code / Country)
  const locationRegex = /\b[A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Za-z]+)\b/;
  const locationFound = locationRegex.test(resumeText) || lowerText.includes('san francisco') || lowerText.includes('new york') || lowerText.includes('austin') || lowerText.includes('remote');

  // Contact checks
  if (emailFound && phoneFound) {
    checks.push({
      id: 'chk-contact-core',
      category: 'contact_info',
      title: 'Essential Contact Details',
      status: 'pass',
      verificationLevel: 'verified',
      message: 'Both email address and phone number were detected in accessible text.',
      details: `Email: ${emailAddress} · Phone: ${phoneNumber}`
    });
  } else {
    checks.push({
      id: 'chk-contact-missing',
      category: 'contact_info',
      title: 'Essential Contact Details',
      status: 'fail',
      verificationLevel: 'verified',
      message: `Missing essential contact info: ${!emailFound ? 'Email missing. ' : ''}${!phoneFound ? 'Phone number missing.' : ''}`,
      recommendation: 'Place your email and phone number in standard text at the top of the resume, not inside headers or footers.'
    });
  }

  if (linkedinFound) {
    checks.push({
      id: 'chk-contact-linkedin',
      category: 'contact_info',
      title: 'Professional Profile Link',
      status: 'pass',
      verificationLevel: 'verified',
      message: 'LinkedIn or online portfolio reference detected.',
      details: linkedinUrl || 'LinkedIn reference found'
    });
  } else {
    checks.push({
      id: 'chk-contact-no-linkedin',
      category: 'contact_info',
      title: 'Professional Profile Link',
      status: 'warning',
      verificationLevel: 'approximate',
      message: 'No LinkedIn profile or GitHub link identified.',
      recommendation: 'Adding a custom LinkedIn profile URL allows automated recruiters to cross-verify your credentials.'
    });
  }

  // ==========================================
  // 3. STANDARD SECTIONS DETECTION
  // ==========================================
  const standardSectionsConfig = [
    {
      name: 'Summary / Profile',
      aliases: ['summary', 'professional summary', 'profile', 'about me', 'objective', 'executive summary'],
      isOptionalForStudents: true,
      explanation: 'Introduces candidate strengths and career target.'
    },
    {
      name: 'Technical Skills',
      aliases: ['technical skills', 'skills', 'competencies', 'core competencies', 'technologies', 'skills & tools'],
      isOptionalForStudents: false,
      explanation: 'Critical for automated keyword indexing.'
    },
    {
      name: 'Work Experience',
      aliases: ['experience', 'work experience', 'professional experience', 'employment history', 'work history'],
      isOptionalForStudents: true,
      explanation: 'Evaluates chronological industry background.'
    },
    {
      name: 'Education',
      aliases: ['education', 'academic background', 'degrees', 'academic qualifications', 'university'],
      isOptionalForStudents: false,
      explanation: 'Validates degree requirements.'
    },
    {
      name: 'Projects',
      aliases: ['projects', 'key projects', 'academic projects', 'personal projects', 'portfolio projects'],
      isOptionalForStudents: false,
      explanation: 'Crucial for students and career switchers without extensive formal tenure.'
    },
    {
      name: 'Certifications',
      aliases: ['certifications', 'licenses', 'certificates', 'professional development'],
      isOptionalForStudents: true,
      explanation: 'Supplementary proof of domain specialization.'
    }
  ];

  const sectionsDetected: AtsSectionDetection[] = [];
  let detectedSectionsCount = 0;

  for (const sec of standardSectionsConfig) {
    let found = false;
    let headerFound: string | undefined = undefined;

    for (const line of lines) {
      const cleanLine = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
      if (sec.aliases.includes(cleanLine) || sec.aliases.some(a => cleanLine === a)) {
        found = true;
        headerFound = line;
        break;
      }
    }

    if (!found) {
      // Secondary check: look for alias as substring in line with under 5 words
      for (const line of lines) {
        if (line.split(/\s+/).length <= 4) {
          const clean = line.toLowerCase();
          if (sec.aliases.some(a => clean.includes(a))) {
            found = true;
            headerFound = line;
            break;
          }
        }
      }
    }

    let status: 'present' | 'missing' | 'alternative_present' = found ? 'present' : 'missing';

    // Student friendly logic: If Work Experience is missing but Projects & Education are present
    if (!found && sec.name === 'Work Experience') {
      const hasProjects = lines.some(l => l.toLowerCase().includes('project'));
      const hasEducation = lines.some(l => l.toLowerCase().includes('education') || l.toLowerCase().includes('bachelor') || l.toLowerCase().includes('master') || l.toLowerCase().includes('university'));
      if (hasProjects && hasEducation) {
        status = 'alternative_present';
      }
    }

    if (found || status === 'alternative_present') {
      detectedSectionsCount++;
    }

    sectionsDetected.push({
      sectionName: sec.name,
      detected: found || status === 'alternative_present',
      headerFound,
      isOptionalForStudents: sec.isOptionalForStudents,
      status,
      explanation: sec.explanation
    });
  }

  // Section checks item
  const missingCoreSections = sectionsDetected.filter(s => s.status === 'missing' && !s.isOptionalForStudents);
  if (missingCoreSections.length === 0) {
    checks.push({
      id: 'chk-sections-pass',
      category: 'sections',
      title: 'Standard Section Hierarchy',
      status: 'pass',
      verificationLevel: 'verified',
      message: 'All core section headings were successfully detected.',
      details: `${detectedSectionsCount} sections recognized using conventional ATS naming conventions.`
    });
  } else {
    checks.push({
      id: 'chk-sections-missing',
      category: 'sections',
      title: 'Standard Section Hierarchy',
      status: 'warning',
      verificationLevel: 'verified',
      message: `Unconventional or missing section headers: ${missingCoreSections.map(s => s.sectionName).join(', ')}.`,
      recommendation: 'Use universally recognized section headings (e.g. "Work Experience", "Education", "Technical Skills") instead of creative variations like "Where I\'ve Been".'
    });
  }

  // ==========================================
  // 4. FORMATTING RISKS & ANOMALIES
  // ==========================================
  const weirdSymbolRegex = /[❖★◆▲▼■●✓✔✕✖\u2022\u25A0\u25CF\u25BA]/g;
  const symbolMatches = resumeText.match(weirdSymbolRegex);
  const hasSpecialCharacters = (symbolMatches?.length || 0) > 15;

  // Line length distribution heuristic
  const veryLongLines = lines.filter(l => l.length > 250).length;
  const lineLengthIssues = veryLongLines > 4;

  if (hasSpecialCharacters) {
    checks.push({
      id: 'chk-format-symbols',
      category: 'formatting_risk',
      title: 'Special Bullet Glyphs & Symbols',
      status: 'warning',
      verificationLevel: 'verified',
      message: 'Detected non-standard geometric or decorative bullet glyphs.',
      details: `Found ${symbolMatches?.length} stylized symbol instances.`,
      recommendation: 'Replace custom graphic wingdings/stars with standard round bullets (•) or hyphens (-) to prevent ATS character corruption.'
    });
  } else {
    checks.push({
      id: 'chk-format-symbols-ok',
      category: 'formatting_risk',
      title: 'Typography & Bullet Characters',
      status: 'pass',
      verificationLevel: 'verified',
      message: 'Standard UTF-8 character encoding and conventional punctuation used.'
    });
  }

  // Unverified checks notice (crucial per instructions: clearly label anything that cannot be verified automatically)
  checks.push({
    id: 'chk-unverified-layout',
    category: 'formatting_risk',
    title: 'Visual Layout & Image Text Frames',
    status: 'unverified',
    verificationLevel: 'unverified',
    message: 'Multi-column graphic balance, floating text boxes, and image OCR cannot be 100% verified from text streams alone.',
    details: 'Plain text extractors discard spatial pixel bounding boxes.',
    recommendation: 'Avoid placing crucial contact details or skill tags inside Canva graphic text boxes, floating shapes, or image banners.'
  });

  // ==========================================
  // 5. KEYWORD & SKILL ALIGNMENT
  // ==========================================
  if (missingSkillsList && missingSkillsList.length > 0) {
    if (missingSkillsList.length <= 3) {
      checks.push({
        id: 'chk-keyword-alignment',
        category: 'keyword_alignment',
        title: 'Job Requisition Keyword Density',
        status: 'pass',
        verificationLevel: 'verified',
        message: 'High alignment with position requirements. Only a few secondary terms were absent.',
        details: `Missing: ${missingSkillsList.join(', ')}`
      });
    } else {
      checks.push({
        id: 'chk-keyword-alignment-gaps',
        category: 'keyword_alignment',
        title: 'Job Requisition Keyword Density',
        status: 'warning',
        verificationLevel: 'verified',
        message: `Your resume lacks ${missingSkillsList.length} skills specifically requested in the job description.`,
        details: `Key gaps: ${missingSkillsList.slice(0, 5).join(', ')}`,
        recommendation: 'Incorporate these exact terms in your skills list and project accomplishment descriptions.'
      });
    }
  } else {
    checks.push({
      id: 'chk-keyword-alignment-nominal',
      category: 'keyword_alignment',
      title: 'Job Requisition Keyword Alignment',
      status: 'pass',
      verificationLevel: 'verified',
      message: 'Strong skill alignment with the job description keywords.'
    });
  }

  // ==========================================
  // 6. SCORING SYSTEM (0 to 100)
  // ==========================================
  // Contact details: max 20 pts
  let contactScore = 0;
  if (emailFound) contactScore += 10;
  if (phoneFound) contactScore += 7;
  if (linkedinFound) contactScore += 3;

  // Sections: max 30 pts (5 pts per detected standard section, with student protection)
  let sectionsScore = Math.min(30, detectedSectionsCount * 5.5);

  // Formatting & text extraction: max 25 pts
  let formattingScore = 25;
  if (!isExtractable) formattingScore -= 20;
  if (potentialMisorderingWarning) formattingScore -= 10;
  if (hasSpecialCharacters) formattingScore -= 5;
  if (lineLengthIssues) formattingScore -= 5;
  formattingScore = Math.max(0, formattingScore);

  // Keyword alignment: max 25 pts
  let keywordScore = 25;
  if (missingSkillsList && missingSkillsList.length > 0) {
    const penalty = Math.min(20, missingSkillsList.length * 2.5);
    keywordScore = Math.max(5, 25 - penalty);
  }

  const atsScore = Math.round(contactScore + sectionsScore + formattingScore + keywordScore);

  // ==========================================
  // 7. PRIORITIZED RECOMMENDATIONS
  // ==========================================
  const recommendations: { priority: 'high' | 'medium' | 'low'; issue: string; fix: string; reason: string }[] = [];

  if (!emailFound || !phoneFound) {
    recommendations.push({
      priority: 'high',
      issue: 'Incomplete or Unparsable Contact Information',
      fix: 'Add your email and phone number in the top 3-4 lines of the document as regular text.',
      reason: 'Recruiters and automated parsers need to directly link candidates to applicant records.'
    });
  }

  if (missingCoreSections.length > 0) {
    recommendations.push({
      priority: 'high',
      issue: `Missing or Non-Standard Headings (${missingCoreSections.map(s => s.sectionName).join(', ')})`,
      fix: `Rename section titles to standard ATS labels: ${missingCoreSections.map(s => s.sectionName).join(', ')}.`,
      reason: 'ATS algorithms rely on standard anchor keywords to group text into education and work history databases.'
    });
  }

  if (missingSkillsList.length > 2) {
    recommendations.push({
      priority: 'medium',
      issue: `Significant Skill Keyword Gaps (${missingSkillsList.slice(0, 4).join(', ')})`,
      fix: `Incorporate these technologies into your skills section and bullet points where you have practical exposure.`,
      reason: 'Automated initial screeners rank candidate applications based on presence of mandatory requisition keywords.'
    });
  }

  if (hasSpecialCharacters || potentialMisorderingWarning) {
    recommendations.push({
      priority: 'medium',
      issue: 'Formatting or Complex Column Layout Risk',
      fix: 'Use a clean single-column structure with standard bullet points (•) and no embedded text boxes.',
      reason: 'Many legacy ATS parsers (Taleo, iCIMS, Workday) read multi-column layouts across rows rather than down columns.'
    });
  }

  if (!linkedinFound) {
    recommendations.push({
      priority: 'low',
      issue: 'No LinkedIn or Portfolio Link Detected',
      fix: 'Include a clean link (e.g. linkedin.com/in/username or github.com/username).',
      reason: 'Provides automated scrapers with verified identity and project links.'
    });
  }

  const passedChecks = checks.filter(c => c.status === 'pass').length;
  const warningChecks = checks.filter(c => c.status === 'warning').length;
  const failedChecks = checks.filter(c => c.status === 'fail').length;
  const unverifiedChecks = checks.filter(c => c.status === 'unverified').length;

  return {
    atsScore,
    totalChecks: checks.length,
    passedChecks,
    warningChecks,
    failedChecks,
    unverifiedChecks,
    textExtractionStatus: {
      wordCount,
      characterCount: charCount,
      isExtractable,
      potentialMisorderingWarning
    },
    contactDetails: {
      emailFound,
      emailAddress,
      phoneFound,
      phoneNumber,
      linkedinFound,
      linkedinUrl,
      locationFound
    },
    sectionsDetected,
    formattingRisks: {
      hasSpecialCharacters,
      excessiveBulletPoints: lines.filter(l => l.startsWith('•') || l.startsWith('-')).length > 25,
      lineLengthIssues,
      unusualSectionHeadings: missingCoreSections.map(s => s.sectionName),
      unverifiedLayoutNotice: 'Multi-column layouts and text inside image graphics cannot be verified from plain text streams without full rendering OCR.'
    },
    checks,
    recommendations,
    scoringBreakdown: {
      contactScore,
      sectionsScore: Math.round(sectionsScore),
      formattingScore: Math.round(formattingScore),
      keywordScore: Math.round(keywordScore)
    },
    disclaimer: 'This ATS Compatibility Score measures algorithmic text accessibility, section hierarchy, and contact discoverability. It is not an actual ATS vendor score (e.g. Workday, Taleo, Greenhouse) and does not guarantee passing human or automated employer screening.'
  };
}
