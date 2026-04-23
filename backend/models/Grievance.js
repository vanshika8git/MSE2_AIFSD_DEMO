const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: {
        type: String,
        enum: ["Academic", "Hostel", "Transport", "Other"]
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Pending", "Resolved"],
        default: "Pending"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }
});

module.exports = mongoose.model("Grievance", grievanceSchema);