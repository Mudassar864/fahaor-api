const express = require('express');
const ImageUpload = require('../models/ImageUpload');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dgmboslsv',
  api_key: '185184138269322',
  api_secret: 'tG0JzLrz7qWG1--RtgddznmLtPU',
});

// Multer Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'landing-login-images', // Cloudinary folder for images
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed formats
    transformation: [{ width: 800, height: 400, crop: 'fill' }], // Resize images
  },
});

const upload = multer({ storage }); // Initialize multer with Cloudinary storage

const router = express.Router();

// Create or Update Images for Landing and Login Pages
// Create or Update Images for Landing and Login Pages
// Create or Update Images for Landing and Login Pages
router.post('/images', upload.fields([
    { name: 'landingImage', maxCount: 1 },
    { name: 'loginImage', maxCount: 1 }
  ]), async (req, res) => {
    console.log("Received image upload request:", req.files);
  
    const { landingImage, loginImage } = req.files;
  
    try {
      // Find the existing image upload document (if any)
      let imageUpload = await ImageUpload.findOne();
  
      if (!imageUpload) {
        // If no images are found in the DB, create a new document
        imageUpload = new ImageUpload();
      }
  
      // Update image URLs if the images are present
      if (landingImage) {
        imageUpload.landingImageUrl = landingImage[0].path;
      }
  
      if (loginImage) {
        imageUpload.loginImageUrl = loginImage[0].path;
      }
  
      // Save the updated image data
      await imageUpload.save();
      console.log("Images saved to database:", imageUpload);
      res.status(201).json(imageUpload);
    } catch (err) {
      console.error("Error uploading images:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
  

// Get All Images (for testing)
router.get('/images', async (req, res) => {
  console.log("Fetching all images...");
  try {
    const images = await ImageUpload.find();
    console.log("Fetched images:", images);
    res.status(200).json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete Images for Landing and Login Pages
// Backend (Express.js)
router.delete("/images/:imageId", async (req, res) => {
    const { imageId } = req.params;
    try {
      // Find and remove the image from your database by its ID
      const deletedImage = await ImageUpload.findByIdAndDelete(imageId);
      if (!deletedImage) {
        return res.status(404).send({ message: "Image not found" });
      }
      res.send({ message: "Image removed successfully" });
    } catch (err) {
      res.status(500).send({ message: "Error removing image" });
    }
  });
  
  

module.exports = router;
