import { Router } from 'express';
import { parseController } from '../controllers/parseController.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { parseRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(parseRateLimiter);

router.post('/extract', uploadResume.single('file'), parseController.extractText);

export default router;
