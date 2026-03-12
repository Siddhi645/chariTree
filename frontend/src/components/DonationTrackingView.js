import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function DonationTrackingView({ donationId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!donationId) return;
    let cancelled = false;
    const fetchTracking = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/donations/${donationId}/tracking`);
        if (!cancelled) setEntries(res.data.tracking || []);
      } catch (err) {
        console.error('Failed to load tracking', err.message || err);
        if (!cancelled) setError('Failed to load tracking updates');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTracking();
    return () => { cancelled = true; };
  }, [donationId]);

  if (!donationId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-2xl shadow-xl w-11/12 max-w-3xl max-h-[80vh] overflow-auto p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-blue-700">Donation Tracking</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">Close</button>
        </div>

        {loading && <div className="text-gray-600">Loading updates…</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !entries.length && <div className="text-gray-600">No tracking updates available for this donation.</div>}

        <div className="space-y-4">
          {entries.map((e) => (
            <div key={e._id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-500">{new Date(e.createdAt).toLocaleString()}</div>
                  <div className="font-medium text-blue-700">{e.title}</div>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-white text-xs ${e.status === 'completed' ? 'bg-green-600' : e.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-400'}`}>{e.status}</span>
                </div>
              </div>
              {e.percentageAllocated > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-600">Allocated: {e.percentageAllocated}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, e.percentageAllocated)}%` }} />
                  </div>
                </div>
              )}
              {e.description && <div className="text-gray-700 mb-2">{e.description}</div>}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
