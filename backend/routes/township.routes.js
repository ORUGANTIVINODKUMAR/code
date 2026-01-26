const express = require("express");
const mongoose = require("mongoose");
const Township = require("../models/Township");

const router = express.Router();

/* ===============================
   CREATE TOWNSHIP
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      townshipName,
      ownerName,
      address,
      city,
      state,
      zip,
      fiscalYearLabel
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const township = await Township.create({
      userId,
      townshipName,
      ownerName,
      address,
      city,
      state,
      zip,
      fiscalYearLabel
    });

    res.status(201).json(township);
  } catch (err) {
    console.error("Create township error:", err);
    res.status(500).json({ message: "Failed to create township" });
  }
});

/* ===============================
   GET ALL TOWNSHIPS FOR USER
================================ */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const townships = await Township.find({ userId });
    res.json(townships);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch townships" });
  }
});

/* ===============================
   ✅ GET SINGLE TOWNSHIP (REPORTS)
================================ */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid township ID" });
    }

    const township = await Township.findById(id);

    if (!township) {
      return res.status(404).json({ message: "Township not found" });
    }

    res.json(township);
  } catch (err) {
    console.error("Get township error:", err);
    res.status(500).json({ message: "Failed to load township" });
  }
});
// ===============================
// GET TOWNSHIP BY ID (FOR REPORTS)
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const township = await Township.findById(req.params.id);

    if (!township) {
      return res.status(404).json({ message: "Township not found" });
    }

    res.json(township);
  } catch (err) {
    console.error("❌ Get township by ID error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
