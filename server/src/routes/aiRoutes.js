import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply AI rate limiter to all AI endpoints
router.use(aiRateLimiter);

router.post('/analyze', aiController.analyze);
router.post('/improve-summary', aiController.improveSummary);
router.post('/improve-bullet', aiController.improveBullet);
router.post('/match-job', aiController.matchJob);

export default router;
