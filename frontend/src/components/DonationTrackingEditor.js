import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';

export default function DonationTrackingEditor({ donationId, organizationId, organizationName, token, onClose, onSaved }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // photos/receipts removed — accept only title/description/percentage/status
  const [percentage, setPercentage] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title) return setError('Please provide a title');
    setLoading(true);
    setError('');
    try {

      const body = {
        organizationId,
        organizationName,
        title,
        description,
        percentageAllocated: percentage ? Number(percentage) : 0,
        status,
        createdBy: 'organization'
      };

      const res = await axios.post(apiUrl(`/api/donations/${donationId}/tracking`), body, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 201) {
        onSaved && onSaved(res.data.tracking);
      } else {
        setError('Failed to save tracking update');
      }
    } catch (err) {
      console.error('Save tracking error', err?.response?.data || err.message || err);
      setError(err?.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-11/12 max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Tracking Update</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="space-y-3">
          <input className="w-full border px-3 py-2 rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="w-full border px-3 py-2 rounded" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          {/* Photos & receipts removed to avoid file/URL issues — use description and status/percentage instead */}
          <div className="flex gap-2">
            <input className="w-28 border px-3 py-2 rounded" placeholder="% Allocated" value={percentage} onChange={e => setPercentage(e.target.value)} />
            <select value={status} onChange={e => setStatus(e.target.value)} className="border px-3 py-2 rounded">
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
