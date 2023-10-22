const multer = require('multer');
const allowedMimeTypes = ['image/jpeg', 'image/png'];

const fileFilter = (req, file, cb) => {

  const fileMimType= file.mimetype;
    if(allowedMimeTypes.includes(fileMimType)){
        cb(null, true);
    } else {
        cb("پسوند فایل صحیح نیست", false);
    }
};
 
 
// Multer configuration
const upload = multer({
    limits: { fileSize: 4000000 },
    fileFilter: fileFilter,
  }).single('image');

  module.exports = { upload, fileFilter };