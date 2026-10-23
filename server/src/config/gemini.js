import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './env.js';

let genAI = null;

if (config.geminiApiKey) {
  genAI = new GoogleGenerativeAI(config.geminiApiKey);
}

/**
 * Retrieves the Gemini model instance or throws a helpful configuration error.
 */
export function getGeminiModel(modelName = config.geminiModel) {
  if (!config.geminiApiKey || config.geminiApiKey.includes('your-gemini-api-key')) {
    throw new Error(
      'Gemini API key is not configured. Please set GEMINI_API_KEY in server/.env to use AI features.'
    );
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }

  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2, // Low temperature for consistent, analytical evaluations
      maxOutputTokens: 2500,
    },
  });
}
