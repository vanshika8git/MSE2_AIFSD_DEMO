const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

// REGISTER (NO TOKEN HERE)
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await Student.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Duplicate Email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Student({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: "Registered Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN (TOKEN GENERATED HERE ONLY)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login Successful",
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };