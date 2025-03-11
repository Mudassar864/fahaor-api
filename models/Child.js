const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // email: { type: String, required: false }, // Removed the email field to avoid any conflicts
    dob: { type: Date, required: true },
    grade: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parentUsername: { type: String, required: true },
    profilePicture: { type: String },
    role: { type: String, default: 'child' },
    points: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'new_children' } // Specify a custom collection name here
);

module.exports = mongoose.model('Child', ChildSchema);
