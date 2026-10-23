import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40, // Limit each IP to 40 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please wait a few minutes before running another AI operation.',
  },
});

export const parseRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Upload rate limit exceeded. Please wait a few minutes.',
  },
});
