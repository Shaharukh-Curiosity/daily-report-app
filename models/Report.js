const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeName: { type: String, required: true },
    date: { type: String, required: true },
    work: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
