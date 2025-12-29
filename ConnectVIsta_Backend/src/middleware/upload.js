const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX files are allowed.'), false);
    }
  }
});

// Middleware for multiple document uploads
const uploadDocuments = upload.fields([
  { name: 'businessRegistration', maxCount: 1 },
  { name: 'governmentId', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'taxCertificate', maxCount: 1 },
  { name: 'insurance', maxCount: 1 }
]);

module.exports = {
  uploadDocuments
};