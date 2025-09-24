'use server';
/**
 * @fileOverview Analyzes text using the Gemini API to determine if it was AI-generated or human-written.
 *
 * - analyzeText - A function that analyzes the text.
 * - AnalyzeTextWithGeminiInput - The input type for the analyzeText function.
 * - AnalyzeTextWithGeminiOutput - The return type for the analyzeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextWithGeminiInputSchema = z.object({
  text: z.string().describe('The text to analyze.'),
});
export type AnalyzeTextWithGeminiInput = z.infer<typeof AnalyzeTextWithGeminiInputSchema>;

const AnalyzeTextWithGeminiOutputSchema = z.object({
  isAiGenerated: z.boolean().describe('Whether the text is AI-generated or not.'),
  confidence: z.number().describe('The confidence score of the AI detection (0-1).'),
  explanation: z.string().describe('A short explanation of why the text is classified as AI or human.'),
});
export type AnalyzeTextWithGeminiOutput = z.infer<typeof AnalyzeTextWithGeminiOutputSchema>;

export async function analyzeText(input: AnalyzeTextWithGeminiInput): Promise<AnalyzeTextWithGeminiOutput> {
  return analyzeTextWithGeminiFlow(input);
}

const analyzeTextWithGeminiPrompt = ai.definePrompt({
  name: 'analyzeTextWithGeminiPrompt',
  input: {schema: AnalyzeTextWithGeminiInputSchema},
  output: {schema: AnalyzeTextWithGeminiOutputSchema},
  prompt: `You are an AI detector. Given the following text, classify whether it was AI-generated or human-written. Output a probability score (0-1) and short reasoning.

Text: {{{text}}}

Respond in JSON format:
{
  "is_ai_generated": true/false,
  "confidence": 0.0-1.0,
  "explanation": "Short explanation"
}
`,
});

const analyzeTextWithGeminiFlow = ai.defineFlow(
  {
    name: 'analyzeTextWithGeminiFlow',
    inputSchema: AnalyzeTextWithGeminiInputSchema,
    outputSchema: AnalyzeTextWithGeminiOutputSchema,
  },
  async input => {
    const {output} = await analyzeTextWithGeminiPrompt(input);
    return output!;
  }
);
