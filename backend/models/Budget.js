const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    townshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Township",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    fiscalYear: {
      type: String,
      required: true
    },

    // 🔑 NEW FIELD (THIS IS THE KEY)
    budgetType: {
      type: String,
      enum: ["GENERAL_TOWN", "ROAD_BRIDGE"],
      required: true
    },

    funds: {
      type: [String],
      required: true
    },

    entries: {
      type: Object,
      default: {}
    },

    history: [
      {
        status: String,
        entries: Object,
        createdAt: Date
      }
    ],

    status: {
      type: String,
      default: "draft"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
