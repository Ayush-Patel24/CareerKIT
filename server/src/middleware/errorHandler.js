import { config } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  // Log server-side error with route context, avoiding logging large resume payloads or keys
  console.error(`[Error] ${req.method} ${req.url}:`, err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  let userMessage = err.message || 'An unexpected error occurred on the server.';

  // Provide friendly guidance for common configuration or external API errors
  if (userMessage.includes('API_KEY_INVALID') || userMessage.includes('GEMINI_API_KEY')) {
    userMessage = 'Gemini API key is invalid or not configured. Please set a valid GEMINI_API_KEY in server/.env.';
  } else if (userMessage.includes('QUOTA_EXCEEDED') || userMessage.includes('RESOURCE_EXHAUSTED')) {
    userMessage = 'Gemini API quota exceeded. Please check your Google AI Studio plan or try again in a few moments.';
  } else if (userMessage.includes('File too large')) {
    userMessage = 'Uploaded file exceeds the 5MB size limit. Please upload a smaller document.';
  }

  res.status(statusCode).json({
    success: false,
    error: userMessage,
    ...(config.nodeEnv === 'development' ? { details: err.stack } : {}),
  });
}
