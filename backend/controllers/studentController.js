const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
    try {
        const { name, email, password, course } = req.body;

        if (!name || !email || !password || !course) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await Student.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new Student({
            name,
            email,
            password: hashedPassword,
            course,
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully. Please login.",
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Enter all fields" });
        }

        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                course: user.course,
            },
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =========================
   UPDATE PASSWORD
========================= */
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both passwords required" });
        }

        const user = await Student.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =========================
   UPDATE COURSE
========================= */
exports.updateCourse = async (req, res) => {
    try {
        const { course } = req.body;

        if (!course) {
            return res.status(400).json({ message: "Course is required" });
        }

        const user = await Student.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.course = course;
        await user.save();

        res.json({ message: "Course updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/* =========================
   GET PROFILE
========================= */
exports.getProfile = async (req, res) => {
    try {
        const user = await Student.findById(req.user._id).select("-password");

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};