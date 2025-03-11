const mongoose = require('mongoose');

const imageUploadSchema = new mongoose.Schema({
    landingImageUrl: {
      type: String,
      required: true, // Make landing image mandatory
    },
    loginImageUrl: {
      type: String,
      required: false, // Make login image optional
    }
  });
  
const ImageUpload = mongoose.model('ImageUpload', imageUploadSchema);

module.exports = ImageUpload;
