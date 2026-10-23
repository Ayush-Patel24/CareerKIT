import { geminiService } from '../services/geminiService.js';

export const aiController = {
  // Analyze Resume
  async analyze(req, res, next) {
    try {
      const { resumeText, jobDescription, resumeTitle } = req.body;

      if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 30) {
        return res.status(400).json({
          success: false,
          error: 'Resume text is required and must contain at least 30 characters.',
        });
      }

      if (resumeText.length > 50000) {
        return res.status(400).json({
          success: false,
          error: 'Resume text exceeds maximum allowed length (50,000 characters).',
        });
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

      if (!bulletText || typeof bulletText !== 'string' || bulletText.trim().length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Bullet text is required to improve.',
        });
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

      if (!resumeText || !jobDescription) {
        return res.status(400).json({
          success: false,
          error: 'Both resume text and job description are required for matching.',
        });
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
