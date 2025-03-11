// middleware/authAdmin.js

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Secret key for JWT (In production, this should be stored in an environment variable)
const JWT_SECRET = "your-secret-key";  // Ideally, move this to an environment variable like process.env.JWT_SECRET

// Middleware to authenticate admin by checking JWT
const authAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Expecting token in "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find admin by decoded id
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Invalid token, admin not found" });
    }

    // Attach the admin information to the request object for future use
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token verification failed", error: error.message });
  }
};

module.exports = authAdmin;
