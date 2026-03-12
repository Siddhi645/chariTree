const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const mongoose = require("mongoose");
const DonationTracking = require("../models/DonationTracking");

// Create a tracking update for a donation (organizations only in production)
router.post("/:donationId/tracking", async (req, res) => {
  try {
    const { donationId } = req.params;
    const {
      organizationId,
      organizationName,
      title,
      description,
      percentageAllocated,
      status,
      createdBy,
    } = req.body;

    console.log("[Tracking POST] params donationId:", donationId);
    console.log("[Tracking POST] body:", JSON.stringify(req.body));

    if (!donationId || !organizationId || !organizationName || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Resolve Donation document _id safely.
    let donation = null;
    // If donationId looks like a valid ObjectId, try to find Donation by that id.
    if (mongoose.Types.ObjectId.isValid(donationId)) {
      donation = await Donation.findById(donationId);
    }

    if (!donation) {
      // Attempt to resolve from organization subdoc (older entries).
      // Only try the subdoc lookup when donationId looks like a valid ObjectId
      // to avoid CastErrors when users submit arbitrary strings.
      if (mongoose.Types.ObjectId.isValid(donationId)) {
        const Organization = require("../models/Organization");
        try {
          const org = await Organization.findOne({ "donations._id": donationId }, { "donations.$": 1, name: 1 });
          if (org && org.donations && org.donations.length) {
            const sub = org.donations[0];
            if (sub.donationRef && mongoose.Types.ObjectId.isValid(sub.donationRef)) {
              donation = await Donation.findById(sub.donationRef);
            } else {
              // Best-effort fallback: try to match by fields, most recent first
              donation = await Donation.findOne({ organizationId: org._id, donorEmail: sub.donorEmail, type: sub.type }).sort({ createdAt: -1 });
            }
          }
        } catch (e) {
          console.warn('[Tracking POST] skipped organization subdoc lookup due to error:', e.message);
        }
      }
    }

    if (!donation) {
      console.warn("[Tracking POST] donation resolution failed for id:", donationId, " — creating tracking with provided id");
    }

    // If donation was found use its canonical _id; otherwise use the provided donationId (string or subdoc id)
    const useDonationId = donation && donation._id ? donation._id : donationId;

    // If donation exists, ensure the organization posting the update actually owns the donation.
    if (donation && organizationId && donation.organizationId && donation.organizationId.toString() !== organizationId.toString()) {
      console.error("[Tracking POST] organizationId mismatch", { organizationId, donationOrg: donation.organizationId.toString() });
      return res.status(403).json({ message: "Organization does not own this donation" });
    }

    const tracking = new DonationTracking({
      donationId: useDonationId,
      organizationId,
      organizationName,
      title,
      description: description || "",
      percentageAllocated: percentageAllocated || 0,
      status: status || "pending",
      createdBy: createdBy || "organization",
    });

    await tracking.save();

    // Optionally we could push the tracking._id onto the Donation model here.
    // For now keep a separate collection and query by donationId.

    return res.status(201).json({ message: "Tracking saved", tracking });
  } catch (err) {
    console.error("[Tracking POST] Error:", err);
    // Return stack in development to help debugging
    return res.status(500).json({ message: "Server error", error: err.message, stack: err.stack });
  }
});

// Get all tracking entries for a donation
router.get("/:donationId/tracking", async (req, res) => {
  try {
    const { donationId } = req.params;
    const entries = await DonationTracking.find({ donationId }).sort({ createdAt: -1 });
    return res.json({ tracking: entries });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get a single tracking entry
router.get("/:donationId/tracking/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;
    const entry = await DonationTracking.findById(trackingId);
    if (!entry) return res.status(404).json({ message: "Tracking entry not found" });
    return res.json({ tracking: entry });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
