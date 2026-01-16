const Budget = require("../models/Budget");

/* ================= CREATE BUDGET ================= */
exports.createBudget = async (req, res) => {
  try {
    const {
      userId,
      townshipId,
      name,
      fiscalYear,
      funds
    } = req.body;

    const budget = await Budget.create({
      userId,
      townshipId,
      name,
      fiscalYear,
      funds,
      status: "draft",
      currentEntries: {},
      history: []
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= SAVE DRAFT ================= */
exports.saveDraft = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { entries } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const version = budget.history.length + 1;

    budget.currentEntries = entries;
    budget.history.push({
      version,
      status: "draft",
      entries
    });

    await budget.save();

    res.json({ message: "Draft saved", budget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= SUBMIT BUDGET ================= */
exports.submitBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.status = "submitted";
    budget.submittedAt = new Date();

    budget.history.push({
      version: budget.history.length + 1,
      status: "submitted",
      entries: budget.currentEntries
    });

    await budget.save();

    res.json({ message: "Budget submitted", budget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= APPROVE BUDGET ================= */
exports.approveBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { approvedBy } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.status = "approved";
    budget.approvedAt = new Date();
    budget.approvedBy = approvedBy;

    budget.history.push({
      version: budget.history.length + 1,
      status: "approved",
      entries: budget.currentEntries
    });

    await budget.save();

    res.json({ message: "Budget approved", budget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET BUDGETS (LIST) ================= */
exports.getBudgets = async (req, res) => {
  try {
    const { userId, townshipId } = req.query;

    const budgets = await Budget.find({
      userId,
      townshipId
    }).sort({ createdAt: -1 });

    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SINGLE BUDGET ================= */
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE BUDGET ================= */
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (budget.status === "approved") {
      return res
        .status(400)
        .json({ message: "Approved budgets cannot be deleted" });
    }

    await budget.deleteOne();
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

