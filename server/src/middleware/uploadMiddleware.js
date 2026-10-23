import multer from 'multer';

const storage = multer.memoryStorage();

const allowedMimes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split('.').pop().toLowerCase();
  if (allowedMimes.includes(file.mimetype) || ['pdf', 'docx', 'doc', 'txt'].includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Please upload a PDF, DOCX, or TXT file.'), false);
  }
};

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum
  },
  fileFilter,
});
