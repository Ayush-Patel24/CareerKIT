import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { getGeminiModel } from '../config/gemini.js';
import { config } from '../config/env.js';

/**
 * Uses Gemini AI multimodal vision capabilities to extract text from image-only,
 * scanned, or flattened Canva/Figma PDFs where traditional pdf-parse finds no text stream.
 */
async function extractWithGeminiOCR(buffer, mimetype, originalName) {
  if (!config.geminiApiKey) {
    throw new Error(
      'Document text stream was empty (likely a scanned or image-based PDF). Please paste your resume text directly into the "Paste Text" tab.'
    );
  }

  const base64Data = buffer.toString('base64');
  const mime = mimetype || (originalName.endsWith('.pdf') ? 'application/pdf' : 'application/pdf');

  console.log(`[DocumentParser] Running Gemini Vision OCR on ${originalName}...`);

  const prompt = `You are a high-precision OCR and resume document extractor.
Extract all readable text from this uploaded resume document accurately.
Preserve all candidate details, including:
- Full Name and Contact Info (Email, Phone, Location, Portfolio, LinkedIn)
- Professional Summary / Objective
- Work Experience (Job titles, company names, dates, responsibilities, bullet points)
- Education (Degrees, institutions, graduation dates, GPA)
- Technical & Soft Skills
- Projects and Certifications

CRITICAL RULES:
- Do NOT summarize or shorten the resume.
- Do NOT add conversational commentary, greetings, or explanations.
- Output ONLY the verbatim extracted resume text in clean Markdown format with standard headings.`;

  const candidateModels = Array.from(
    new Set([config.geminiModel, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'])
  );

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = getGeminiModel(modelName);
      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: mime,
          },
        },
        { text: prompt },
      ]);

      const text = result.response.text();
      return text ? text.trim() : '';
    } catch (err) {
      lastError = err;
      console.warn(`OCR model ${modelName} failed (${err.message?.slice(0, 80)}...). Trying fallback...`);
    }
  }

  throw lastError || new Error('Could not extract text from document using OCR.');
}

/**
 * Extracts plain text from an uploaded resume buffer (PDF, DOCX, or TXT)
 * Includes automatic Gemini Multimodal Vision OCR fallback for scanned/Canva PDFs.
 */
export async function extractTextFromBuffer(buffer, mimetype, originalName = '') {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty file received');
  }

  const extension = originalName.split('.').pop().toLowerCase();
  let extractedText = '';
  let usedOCR = false;

  try {
    if (mimetype === 'application/pdf' || extension === 'pdf') {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || '';
      } catch (pdfErr) {
        console.warn(`Local pdf-parse failed for ${originalName}: ${pdfErr.message}. Attempting Gemini OCR fallback...`);
      }

      // If local pdf-parse extracted little to no text (common with Canva, Photoshop, or scanned resumes)
      if (!extractedText || extractedText.trim().length < 30) {
        console.log(`Local pdf-parse found insufficient text (${extractedText?.trim()?.length || 0} chars). Falling back to Gemini Multimodal OCR...`);
        extractedText = await extractWithGeminiOCR(buffer, mimetype, originalName);
        usedOCR = true;
      }
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword' ||
      extension === 'docx'
    ) {
      const docResult = await mammoth.extractRawText({ buffer });
      extractedText = docResult.value || '';
    } else if (mimetype === 'text/plain' || extension === 'txt') {
      extractedText = buffer.toString('utf-8');
    } else {
      throw new Error(`Unsupported file type: ${mimetype || extension}. Please upload PDF, DOCX, or TXT.`);
    }

    // Clean up control characters while preserving formatting
    const cleanedText = extractedText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanedText || cleanedText.length < 20) {
      throw new Error(
        'Could not extract readable text from document. If your resume was designed in Canva or scanned as an image, please copy and paste the text directly into the "Paste Text" tab.'
      );
    }

    // Safe length limit
    const MAX_LENGTH = 50000;
    const finalResult = cleanedText.length > MAX_LENGTH ? cleanedText.substring(0, MAX_LENGTH) : cleanedText;

    return {
      text: finalResult,
      length: finalResult.length,
      originalName,
      usedOCR,
      truncated: cleanedText.length > MAX_LENGTH,
    };
  } catch (err) {
    console.error(`Document parsing error for ${originalName}:`, err.message);
    throw new Error(err.message || 'Failed to extract text from document');
  }
}
