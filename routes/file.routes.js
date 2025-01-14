const express = require('express');
const fileController = require('../controllers/file.controller');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');

//ROUTES
const s3 = new aws.S3(); 
const BUCKET_NAME = process.env.BUCKET_NAME;

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + "-" + file.originalname);  // Unique file name to avoid conflicts
      }
    }),
    fileFilter: function (req, file, cb) {
      // Accept all file types
      cb(null, true);  // Call with 'true' to accept all files
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit per file
  });

// POST
router.post('/upload-files', upload.array('files', 5), fileController.addAgentData);

// // // GET
//  router.get('/get-files', fileController.getallcalls);


module.exports = router;