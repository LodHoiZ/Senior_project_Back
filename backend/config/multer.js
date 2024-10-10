const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(__dirname, '../static/uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const mimetypes = {
      'application/pdf': '.pdf',
    };
    const random = crypto.randomBytes(3).toString('hex');
    cb(null, new Date().getTime() + '-' + random + mimetypes[file.mimetype]);
  },
});

const fileFilter = (req, file, cb) => {
  const mimetypeImages = ['application/pdf'];
  cb(null, mimetypeImages.includes(file.mimetype));
};

module.exports = multer({
  storage,
  fileFilter,
});
