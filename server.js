const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db.service.js/db.conn');
const index = require('./routes/index');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS Middleware
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,  // Allow only specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
}));

// Create DB if not created
db.createDatabase();

// Routes
app.use('/api', index);

// AWS S3 Configuration (Using AWS SDK v2)
aws.config.update({
  secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

const s3 = new aws.S3(); // Use AWS SDK v2 for S3 client
const BUCKET_NAME = process.env.BUCKET_NAME;

// Multer for File Uploads
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

// Multiple Files Upload Route
app.post('/upload', upload.array('files', 5), (req, res) => {
  if (req.files && req.files.length > 0) {
    // Extract URLs for all uploaded files
    const fileUrls = req.files.map(file => file.location);  // file.location contains the S3 URL of the uploaded file

    return res.status(200).json({
      message: 'Files uploaded successfully',
      fileUrls: fileUrls
    });
  }
  return res.status(400).send('No files uploaded');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Server Configuration
const port = process.env.PORT || 5000;
const ipAddress = process.env.IP_ADDRESS || 'localhost';

app.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});
