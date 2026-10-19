import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to unpkg/cdnjs or disable worker in modern bundlers
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    // Worker fallback
  }
}

export interface ParseResult {
  text: string;
  wordCount: number;
  filename: string;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

/**
 * Validates file size and format
 */
export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }
  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty (0 bytes). Please upload a valid document.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10 MB limit. Please upload a smaller file.` 
    };
  }

  const name = file.name.toLowerCase();
  const validExts = ['.pdf', '.docx', '.doc', '.txt', '.md', '.rtf'];
  const hasValidExt = validExts.some(ext => name.endsWith(ext));

  if (!hasValidExt) {
    return {
      valid: false,
      error: `Unsupported file format. Please upload a PDF (.pdf), Word Document (.docx), or plain text file (.txt).`
    };
  }

  return { valid: true };
}

/**
 * Extracts plain text from a PDF ArrayBuffer
 */
export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    const textPieces: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      textPieces.push(pageText);
    }

    const combined = textPieces.join('\n\n').trim();
    return combined;
  } catch (err: any) {
    console.warn('PDF.js parse warning, attempting raw stream fallback', err);
    // Fallback: extract readable string chunks from raw buffer
    const decoder = new TextDecoder('utf-8');
    const raw = decoder.decode(buffer);
    const matches = raw.match(/\(([^()]+)\)/g);
    if (matches && matches.length > 15) {
      return matches.map(m => m.slice(1, -1)).filter(s => s.length > 2 && !s.startsWith('\\')).join(' ');
    }
    throw new Error('Could not parse text from this PDF file. It might be scanned without OCR.');
  }
}

/**
 * Extracts plain text from a DOCX ArrayBuffer using mammoth
 */
export async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value.trim();
  } catch (err: any) {
    throw new Error(`Failed to extract text from DOCX: ${err.message}`);
  }
}

/**
 * Unified file parsing function with complete validation
 */
export async function parseDocumentFile(file: File): Promise<ParseResult> {
  const validation = validateDocumentFile(file);
  if (!validation.valid) {
    return {
      text: '',
      wordCount: 0,
      filename: file.name,
      error: validation.error
    };
  }

  const name = file.name.toLowerCase();

  try {
    let extractedText = '';

    if (name.endsWith('.txt') || name.endsWith('.md')) {
      extractedText = await file.text();
    } else if (name.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer();
      extractedText = await extractPdfText(buffer);
    } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
      const buffer = await file.arrayBuffer();
      extractedText = await extractDocxText(buffer);
    }

    const clean = extractedText.replace(/\r\n/g, '\n').trim();
    const words = clean.split(/\s+/).filter(Boolean);

    if (words.length < 5) {
      return {
        text: clean,
        wordCount: words.length,
        filename: file.name,
        error: 'The document appears to contain very little or no readable text. Ensure it is not an image-only scan.'
      };
    }

    return {
      text: clean,
      wordCount: words.length,
      filename: file.name
    };
  } catch (err: any) {
    return {
      text: '',
      wordCount: 0,
      filename: file.name,
      error: err.message || 'Failed to read file contents.'
    };
  }
}
