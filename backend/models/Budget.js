const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    townshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Township" },

    name: String,
    fiscalYear: String,
    funds: [String],

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

// ✅ THIS LINE IS REQUIRED
module.exports = mongoose.model("Budget", BudgetSchema);
