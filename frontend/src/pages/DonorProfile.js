import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DonorNavbar from '../components/DonorNavbar';
import axios from 'axios';
import DonationTrackingView from '../components/DonationTrackingView';

export default function DonorProfile() {
  const [email, setEmail] = useState('');
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  const fetchDonations = async () => {
    if (!email) return setError('Please enter an email');
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/donations/donor/${encodeURIComponent(email)}`);
      const list = res.data.donations || [];
      setDonations(list);
      // compute quick summaries
      const monetary = list.filter((d) => d.type === 'monetary' || d.type === 'split');
      const wishlist = list.filter((d) => d.type === 'item' || d.type === 'wishlist');
      setSummary({
        totalMonetary: monetary.reduce((s, x) => s + (Number(x.amount) || 0), 0),
        monetaryCount: monetary.length,
        wishlistCount: wishlist.length,
      });
      setSearched(true);
    } catch (err) {
      console.error('Failed to fetch donations', err.message || err);
      setError('Failed to fetch donations. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white px-6 py-10">
      <DonorNavbar />

      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold text-blue-700 text-center mb-6">
        Donor Profile — Donation Tracker
      </motion.h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <label className="block text-gray-700 mb-2 font-medium">Enter registered email to view donation history</label>
        <div className="flex gap-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 border rounded-lg px-4 py-2" />
          <button onClick={fetchDonations} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">{loading ? 'Loading…' : 'Search'}</button>
        </div>
        {error && <div className="text-red-500 mt-3">{error}</div>}
      </div>

      {searched && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mt-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">{donations.length ? 'Your Donations' : 'No Donations Found'}</h2>
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-sky-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">Total Donated</div>
              <div className="text-xl font-bold text-blue-700">₹{summary?.totalMonetary || 0}</div>
            </div>
            <div className="p-4 bg-sky-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">Monetary Donations</div>
              <div className="text-xl font-bold text-blue-700">{summary?.monetaryCount || 0}</div>
            </div>
            <div className="p-4 bg-sky-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">Wishlist Donations</div>
              <div className="text-xl font-bold text-blue-700">{summary?.wishlistCount || 0}</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-sky-100 text-gray-700">
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Organization</th>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">Details</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-sky-50 transition">
                    <td className="p-3 border text-gray-600">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 border font-medium text-blue-700">{d.organizationName}</td>
                    <td className="p-3 border text-gray-600 capitalize">{d.type}</td>
                    <td className="p-3 border text-gray-600">{d.type === 'monetary' ? `₹${d.amount}` : `${d.item || d.details || ''} ${d.quantity ? `(${d.quantity})` : ''}`}</td>
                    <td className={`p-3 border font-semibold ${d.status && d.status.toLowerCase() === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>{d.status || 'Completed'}</td>
                    <td className="p-3 border">
                      <button
                        onClick={() => { setSelectedDonationId(d._id); setTrackingOpen(true); }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {trackingOpen && (
            <DonationTrackingView donationId={selectedDonationId} onClose={() => { setTrackingOpen(false); setSelectedDonationId(null); }} />
          )}
        </motion.div>
      )}
    </div>
  );
}
