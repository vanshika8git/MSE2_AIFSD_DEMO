const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
    createGrievance,
    getGrievances,
    getGrievanceById,
    updateGrievance,
    deleteGrievance,
    searchGrievance
} = require("../controllers/grievanceController");

const router = express.Router();

router.post("/grievances", authMiddleware, createGrievance);
router.get("/grievances", authMiddleware, getGrievances);
router.get("/grievances/search", authMiddleware, searchGrievance);
router.get("/grievances/:id", authMiddleware, getGrievanceById);
router.put("/grievances/:id", authMiddleware, updateGrievance);
router.delete("/grievances/:id", authMiddleware, deleteGrievance);

module.exports = router;