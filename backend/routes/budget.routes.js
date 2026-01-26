const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");

/* ================= CREATE BUDGET ================= */
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      townshipId,
      name,
      fiscalYear,
      funds,
      budgetType // 👈 NEW
    } = req.body;

    if (!budgetType) {
      return res.status(400).json({
        message: "budgetType is required"
      });
    }

    const budget = await Budget.create({
      userId,
      townshipId,
      name,
      fiscalYear,
      funds,
      budgetType, // 👈 SAVED HERE
      entries: {},
      history: [],
      status: "draft"
    });

    res.status(201).json(budget);
  } catch (err) {
    console.error("CREATE BUDGET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});



/* ================= LIST BUDGETS ================= */
router.get("/", async (req, res) => {
  try {
    const { userId, townshipId, status } = req.query;

    if (!userId || !townshipId) {
      return res.status(400).json({
        message: "userId and townshipId are required"
      });
    }

    const filter = {
      userId,
      townshipId
    };

    if (status) {
      filter.status = status;
    }

    const budgets = await Budget.find(filter).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    console.error("LIST BUDGETS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET SINGLE BUDGET ================= */
router.get("/:id", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.json(budget);
  } catch (err) {
    console.error("GET BUDGET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= UPDATE BUDGET ================= */
router.put("/:id", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (req.body.entries) {
      budget.entries = req.body.entries;
    }

    if (req.body.status) {
      budget.status = req.body.status;
    }

    if (req.body.historyEntry) {
      budget.history.push({
        ...req.body.historyEntry,
        createdAt: new Date()
      });
    }

    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error("UPDATE BUDGET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
