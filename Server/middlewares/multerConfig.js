const multer = require('multer');
const path = require('path');

// Cấu hình lưu file theo fieldname
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'originalImage') {
      cb(null, 'design/');
    } else if (file.fieldname === 'designedImage') {
      cb(null, 'designed/');
    } else {
      cb(new Error('Trường ảnh không hợp lệ'), null);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

// Cấu hình cụ thể cho 2 field ảnh
const upload = multer({ storage }).fields([
  { name: 'originalImage', maxCount: 1 },
  { name: 'designedImage', maxCount: 1 }
]);

module.exports = upload;
