const mongoose = require('mongoose');

const volunteerApplicationSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  orgName: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  availability: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
