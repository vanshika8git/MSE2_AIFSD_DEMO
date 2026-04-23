const Grievance = require("../models/Grievance");

// CREATE
const createGrievance = async (req, res) => {
    try {
        const grievance = new Grievance({
            ...req.body,
            user: req.user
        });

        await grievance.save();
        res.json(grievance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getGrievances = async (req, res) => {
    try {
        const data = await Grievance.find({ user: req.user });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET BY ID
const getGrievanceById = async (req, res) => {
    try {
        const data = await Grievance.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Not Found" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateGrievance = async (req, res) => {
    try {
        const data = await Grievance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deleteGrievance = async (req, res) => {
    try {
        await Grievance.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SEARCH
const searchGrievance = async (req, res) => {
    try {
        const { title } = req.query;

        const results = await Grievance.find({
            title: { $regex: title, $options: "i" },
            user: req.user
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createGrievance,
    getGrievances,
    getGrievanceById,
    updateGrievance,
    deleteGrievance,
    searchGrievance
};