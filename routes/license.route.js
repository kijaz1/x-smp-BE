const express = require('express');
const license = require('../controllers/license.controller');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const router = express.Router();

aws.config.update({
    secretAccessKey: process.env.SECRET_KEY,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
});

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
router.post('/add-license-agent', upload.array('files', 5), (req, res) => {
    // Assuming files are uploaded to a specific folder, e.g., 'uploads'
    const fileUrls = [];
    if (req.files) {
        req.files.map(file => {
            fileUrls.push(file.location);
        });
    }
    // You can now pass the file URLs to your 'addOrUpdateLicense' function
    license.addOrUpdateLicense(req, res, fileUrls);
});

router.get('/get-agent-data', license.getAgentData);

module.exports = router;