import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DonorNavbar from "../components/DonorNavbar";

export default function VolunteerDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/organizations');
        setOrganizations(res.data || []);
        setError("");
      } catch (err) {
        console.warn('Failed to fetch organizations:', err.message || err);
        // fallback small mock
        setOrganizations([
          { _id: 'org_1', name: 'Helping Hands', category: 'Child Welfare', location: 'Pune' },
          { _id: 'org_2', name: 'Health Aid', category: 'Healthcare', location: 'Chennai' },
        ]);
        setError('Showing fallback organizations — backend /api/organizations unreachable.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white px-6 py-10">
      <DonorNavbar />

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-blue-700 text-center mb-6"
      >
        Volunteer Dashboard
      </motion.h1>

      <main className="max-w-6xl mx-auto">

        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-800 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading…</div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Organizations to Volunteer With</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <div key={org._id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-default">
                  <div className="font-bold text-lg text-blue-700">{org.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{org.category}</div>
                  <div className="text-sm text-gray-400">📍 {org.location}</div>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate('/volunteer-landing', { state: { org } })}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg w-full hover:bg-green-700 transition"
                    >
                      Volunteer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
