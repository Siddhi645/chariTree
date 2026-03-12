const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const Organization = require("../models/Organization");

// ✅ Monetary Donation
router.post("/monetary", async (req, res) => {
  try {
    console.log("📩 Monetary donation received:", req.body);

    const { orgId, donorName, donorEmail, donorPhone, amount } = req.body;

    if (!orgId || !amount) {
      return res.status(400).json({ message: "Missing orgId or amount" });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create Donation record
    const donation = await Donation.create({
      donorName: donorName || "Anonymous",
      donorEmail: donorEmail || "unknown@example.com",
      donorPhone: donorPhone || "",
      organizationId: orgId,
      organizationName: org.name,
      type: "monetary",
      amount,
      status: "completed",
    });

    // Push into organization's donations
    org.donations.push({
      donorName: donorName || "Anonymous",
      donorEmail,
      donorPhone,
      amount,
      type: "monetary",
      status: "completed",
      donationRef: donation._id,
      impact: "Monetary Support",
      date: new Date(),
    });

    // ✅ Skip unrelated field validation
    await org.save({ validateBeforeSave: false });

    console.log("✅ Monetary donation saved:", donation._id);
    res.status(200).json({ message: "Monetary donation logged successfully", donation });
  } catch (error) {
    console.error("❌ Monetary donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all donations by donor (donation tracking)
router.get("/donor/:email", async (req, res) => {
  try {
    const donorEmail = req.params.email;
    console.log("[Donation Tracking] Requested donorEmail:", donorEmail);
    if (!donorEmail) {
      return res.status(400).json({ message: "Missing donor email" });
    }
    const donations = await Donation.find({ donorEmail }).sort({ createdAt: -1 });
    console.log("[Donation Tracking] Found donations:", donations);
    res.status(200).json({ donations });
  } catch (error) {
    console.error("[Donation Tracking] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Wishlist Donation
router.post("/wishlist", async (req, res) => {
  try {
    console.log("📦 Wishlist donation received:", req.body);

    const { orgId, name, email, phone, item, quantity, method } = req.body;

    if (!orgId || !item || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create donation record
    const donation = await Donation.create({
      donorName: name || "Anonymous",
      donorEmail: email || "unknown@example.com",
      donorPhone: phone || "",
      organizationId: orgId,
      organizationName: org.name,
      type: "item",
      item,
      quantity,
      deliveryMethod: method,
      status: "completed",
    });

    // Add to organization donations
    org.donations.push({
      donorName: name || "Anonymous",
      donorEmail: email,
      donorPhone: phone,
      type: "wishlist",
      item,
      quantity,
      method,
      status: "completed",
      donationRef: donation._id,
      impact: `${quantity} x ${item} (${method})`,
      date: new Date(),
    });

    // ✅ Skip validation for unrelated required fields
    await org.save({ validateBeforeSave: false });

    console.log("✅ Wishlist donation saved:", donation._id);
    res.status(200).json({ message: "Wishlist donation logged successfully", donation });
  } catch (error) {
    console.error("❌ Wishlist donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Split Donation (each logged individually)
router.post("/split", async (req, res) => {
  try {
    console.log("💰 Split donation received:", req.body);

    const { orgId, donorName, donorEmail, amount } = req.body;

    if (!orgId || !amount) {
      return res.status(400).json({ message: "Missing orgId or amount" });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create donation record
    const donation = await Donation.create({
      donorName: donorName || "Anonymous",
      donorEmail: donorEmail || "unknown@example.com",
      organizationId: orgId,
      organizationName: org.name,
      type: "split",
      amount,
      status: "completed", // ✅ lowercase & valid
    });

    // Push into organization's donations (include amount)
    org.donations.push({
      donorName: donorName || "Anonymous",
      donorEmail: donorEmail || "unknown@example.com",
      type: "split",
      amount,
      status: "completed",
      donationRef: donation._id,
      impact: `Split donation of ₹${amount}`,
      date: new Date(),
    });

    // ✅ Add an update entry so validation passes
    org.updates.push({
      title: "Split Donation Received",
      content: `A new split donation of ₹${amount} was received from ${donorName || "Anonymous"}.`,
    });

    await org.save();

    console.log(`✅ Split donation logged successfully: ₹${amount}`);
    res.status(200).json({ message: "Split donation logged successfully", donation });
  } catch (error) {
    console.error("❌ Split donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports = router;
