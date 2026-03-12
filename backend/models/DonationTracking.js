const mongoose = require("mongoose");

const donationTrackingSchema = new mongoose.Schema({
  // Allow donationId to be either an ObjectId or an arbitrary string so tracking
  // entries can be created even when the canonical Donation document isn't found.
  donationId: { type: mongoose.Schema.Types.Mixed, required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  organizationName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  percentageAllocated: { type: Number, min: 0, max: 100, default: 0 },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  createdBy: { type: String, default: "organization" }, // could be 'organization' or admin id
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DonationTracking", donationTrackingSchema);
