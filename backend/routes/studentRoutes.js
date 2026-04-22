const express = require("express");
const {
    register,
    login,
    updatePassword,
    updateCourse,
} = require("../controllers/studentController.js");
const protect = require("../middleware/authMiddleware.js");
const { getProfile } = require("../controllers/studentController");

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.put("/update-password", protect, updatePassword);
router.put("/update-course", protect, updateCourse);

router.get("/profile", protect, getProfile);

module.exports = router;