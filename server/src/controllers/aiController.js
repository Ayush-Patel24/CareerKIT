import { geminiService } from '../services/geminiService.js';
import {
  validateResumeText,
  validateJobDescription,
  validateBulletText,
} from '../validators/resumeValidator.js';

export const aiController = {
  // Analyze Resume
  async analyze(req, res, next) {
    try {
      const { resumeText, jobDescription, resumeTitle } = req.body;

      const validation = validateResumeText(resumeText);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const analysis = await geminiService.analyzeResume({
        resumeText: resumeText.trim(),
        jobDescription: jobDescription?.trim() || '',
        resumeTitle: resumeTitle?.trim() || 'Uploaded Resume',
      });

      res.status(200).json({
        success: true,
        analysis,
      });
    } catch (err) {
      next(err);
    }
  },

  // Improve Summary
  async improveSummary(req, res, next) {
    try {
      const { currentSummary, personalInfo, experience, skills } = req.body;

      const result = await geminiService.improveSummary({
        currentSummary: currentSummary || '',
        personalInfo: personalInfo || {},
        experience: experience || [],
        skills: skills || [],
      });

      res.status(200).json({
        success: true,
        suggestions: result.suggestions || [],
      });
    } catch (err) {
      next(err);
    }
  },

  // Improve Bullet
  async improveBullet(req, res, next) {
    try {
      const { bulletText, role, company } = req.body;

      const validation = validateBulletText(bulletText);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const result = await geminiService.improveBullet({
        bulletText: bulletText.trim(),
        role: role || '',
        company: company || '',
      });

      res.status(200).json({
        success: true,
        suggestions: result.suggestions || [],
      });
    } catch (err) {
      next(err);
    }
  },

  // Match Job
  async matchJob(req, res, next) {
    try {
      const { resumeText, jobDescription } = req.body;

      const resumeValidation = validateResumeText(resumeText);
      if (!resumeValidation.valid) {
        return res.status(400).json({ success: false, error: resumeValidation.error });
      }
      const jdValidation = validateJobDescription(jobDescription);
      if (!jdValidation.valid) {
        return res.status(400).json({ success: false, error: jdValidation.error });
      }

      const result = await geminiService.matchJobDescription({
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim(),
      });

      res.status(200).json({
        success: true,
        match: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
