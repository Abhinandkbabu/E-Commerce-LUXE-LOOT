
const multer = require('multer');
const path = require('path');

// Handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}_${file.originalname}`); 
  },
});

// Dynamically handle file uploads for any number of images
const upload = multer({ storage });

module.exports = upload; 
