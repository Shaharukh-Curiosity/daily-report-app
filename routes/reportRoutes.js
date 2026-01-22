const express = require("express");
const Report = require("../models/Report");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// create report (employee)
router.post("/", auth, async (req, res) => {
  try {
    const { date, work } = req.body;

    if (!date || !work) {
      return res.status(400).json({ msg: "date and work required" });
    }

    const report = await Report.create({
      employeeId: req.user.id,
      employeeName: req.user.name,
      date,
      work
    });

    res.status(201).json({ msg: "report submitted ✅", report });
  } catch (err) {
    res.status(500).json({ msg: "server error", error: err.message });
  }
});

// get all reports (all logged-in users)
router.get("/", auth, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: "server error", error: err.message });
  }
});

// admin update report
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: "report not found" });

    res.json({ msg: "report updated ✅", updated });
  } catch (err) {
    res.status(500).json({ msg: "server error", error: err.message });
  }
});

// admin delete report
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "report not found" });

    res.json({ msg: "report deleted ✅" });
  } catch (err) {
    res.status(500).json({ msg: "server error", error: err.message });
  }
});

module.exports = router;
