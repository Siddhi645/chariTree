const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// GET /api/volunteers/me/applications
// Returns a list of volunteer applications for the current user (mocked)
router.get('/me/applications', (req, res) => {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'organizations.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const orgs = JSON.parse(raw);

    // Create a couple of mock applications using organizations data
    const apps = orgs.slice(0, 3).map((org, idx) => ({
      _id: `app_${Date.now()}_${idx}`,
      opportunityTitle: idx === 1 ? 'Food Distribution' : idx === 2 ? 'Teaching Session' : 'Park Clean-up',
      organization: org.name,
      date: idx === 1 ? '2025-11-30' : idx === 2 ? '2025-12-10' : '2025-12-05',
      location: org.location || 'Unknown',
      status: idx === 1 ? 'approved' : idx === 0 ? 'pending' : 'rejected',
      message: idx === 0 ? 'Available weekends' : 'Can bring 2 friends',
      loggedHours: idx === 1 ? 4 : 0,
    }));

    return res.json(apps);
  } catch (err) {
    console.error('Error preparing volunteer applications:', err);
    return res.status(500).json({ message: 'Failed to load volunteer applications' });
  }
});

module.exports = router;
