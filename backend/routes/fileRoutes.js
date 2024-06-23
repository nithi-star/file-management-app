const express = require('express');
const { uploadFile, getFiles, deleteFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getFiles);
router.delete('/:filename', protect, deleteFile);

module.exports = router;
