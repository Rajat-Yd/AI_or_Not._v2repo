'use server';

import { analyzeText, AnalyzeTextWithGeminiOutput } from '@/ai/flows/analyze-text-with-gemini';
import mammoth from 'mammoth';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function performAnalysis(text: string): Promise<{ result: AnalyzeTextWithGeminiOutput | null; error: string | null; }> {
  if (!text || text.trim().length < 50) {
    return { result: null, error: "Please provide at least 50 characters for an accurate analysis." };
  }
  
  try {
    const result = await analyzeText({ text });
    return { result, error: null };
  } catch (e) {
    console.error(e);
    return { result: null, error: 'An error occurred during analysis. The AI model may be busy. Please try again later.' };
  }
}

export async function extractTextFromFile(fileBuffer: ArrayBuffer, fileType: string): Promise<{text: string | null; error: string | null}> {
  try {
    if (fileType === 'application/pdf') {
      const data = await pdf(Buffer.from(fileBuffer));
      return { text: data.text, error: null };
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
      const { value } = await mammoth.extractRawText({ buffer: Buffer.from(fileBuffer) });
      return { text: value, error: null };
    } else if (fileType === 'text/plain') {
        return { text: Buffer.from(fileBuffer).toString('utf-8'), error: null };
    }
    return { text: null, error: 'Unsupported file type. Please upload a .txt, .pdf, or .docx file.' };
  } catch(e) {
    console.error(e);
    return { text: null, error: 'Failed to extract text from the file.' };
  }
}
