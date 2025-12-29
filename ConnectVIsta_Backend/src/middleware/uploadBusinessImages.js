const multer = require('multer');
const path = require('path');

// Configure storage for local file system
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/business-images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'business-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for business images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF)'), false);
  }
};

const uploadBusinessImages = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = uploadBusinessImages;