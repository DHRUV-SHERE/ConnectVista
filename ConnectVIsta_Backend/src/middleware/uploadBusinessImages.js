const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

// Create Cloudinary storage engine for business images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'connectvista/business-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    resource_type: 'image',
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  },
});

// File filter for business images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().match(/\.[0-9a-z]+$/i)?.[0] || '');
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