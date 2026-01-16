const mongoose = require("mongoose");

const TownshipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    townshipName: { type: String, required: true },
    ownerName: { type: String, required: true },
    address: String,
    city: String,
    state: String,
    zip: String,
    fiscalYearLabel: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Township", TownshipSchema);
