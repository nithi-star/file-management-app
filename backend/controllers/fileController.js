const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const storage = new Storage({ keyFilename: path.join(__dirname, '../google-credentials.json') });

const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

const uploadFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    await storage.bucket(bucketName).upload(filePath, {
      destination: req.file.filename,
    });
    fs.unlinkSync(filePath);
    
    const file = new File({
      user: req.user.id,
      filename: req.file.filename,
      originalname: req.file.originalname,
    });
    await file.save();

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    await storage.bucket(bucketName).file(filename).delete();
    await File.deleteOne({ user: req.user.id, filename });
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadFile, getFiles, deleteFile };
