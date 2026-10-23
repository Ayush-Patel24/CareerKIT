import { extractTextFromBuffer } from '../services/documentParser.js';

export const parseController = {
  async extractText(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No document file uploaded. Please attach a PDF, DOCX, or TXT file.',
        });
      }

      const result = await extractTextFromBuffer(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );

      res.status(200).json({
        success: true,
        text: result.text,
        metadata: {
          filename: result.originalName,
          length: result.length,
          truncated: result.truncated,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
