
import * as multer from 'multer';
import * as path from 'path';
import { promisify } from 'util';
import { generateRandomString } from '../utils';

const maxFileSize = 4 * 1024 * 1024; // 4 MB

let storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "./public/uploads/");
   },
   filename: (req, file, cb) => {
      console.log(file.originalname);
      const { ext } = path.parse(file.originalname);
      cb(null, generateRandomString(24) + ext);
   },
});

const uploadFile = multer({
   storage: storage,
   limits: { fileSize: maxFileSize },
   fileFilter: function (req, file, callback) {
      
      var ext = path.extname(file.originalname).toLowerCase();
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif') {
         return callback(new Error('Only images (PNG, JPG, JPEG and GIF) are allowed'))
      }
      callback(null, true)
  },
}).single("file");

const uploadFileMiddleware = promisify(uploadFile);

export { uploadFileMiddleware as uploadFile }
