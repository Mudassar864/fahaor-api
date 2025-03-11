// routes/admin.js

const express = require("express");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const authAdmin = require("../middleware/authadmin");  // Import the authAdmin middleware
const router = express.Router();

// Secret key for JWT (In production, this should be stored in an environment variable)
const JWT_SECRET = "your-secret-key";  // Ideally, move this to an environment variable like process.env.JWT_SECRET

// Route to log in (POST /api/admin/login)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "1h" }  // Token expiration (e.g., 1 hour)
    );

    // Respond with the token
    res.status(200).json({
      message: "Login successful",
      token,  // Send token in response
    });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error: error.message });
  }
});

// Route to create an admin account (POST /api/admin/create)
router.post("/create", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error: error.message });
  }
});

// Route to get all admins (GET /api/admin/list) - Protected by authAdmin
router.get("/list", authAdmin, async (req, res) => {
  try {
    const admins = await Admin.find();  // Get all admins from DB
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
});

// Route to delete an admin (DELETE /api/admin/delete/:id) - Protected by authAdmin
router.delete("/delete/:id", authAdmin, async (req, res) => {
  const adminId = req.params.id;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deletion of the currently logged-in admin
    if (admin._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({ message: "Cannot delete the currently logged-in admin" });
    }

    await Admin.findByIdAndDelete(adminId);
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
});

module.exports = router;
