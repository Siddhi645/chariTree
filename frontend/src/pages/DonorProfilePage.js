import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function DonorProfilePage() {
  const [email, setEmail] = useState("");
  const [donations, setDonations] = useState([]);
  const [searched, setSearched] = useState(false);

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`/api/donations/by-email/${email}`);
      setDonations(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch donation history.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white px-6 py-10">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold text-blue-700 text-center mb-6"
      >
        Donor Profile
      </motion.h1>

      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md mb-10">
        <label className="block text-gray-700 mb-2 font-medium">Enter your registered email</label>
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            onClick={fetchDonations}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {searched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            {donations.length ? "Your Past Donations" : "No Donations Found"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-sky-100 text-gray-700">
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Organization</th>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">Details</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-sky-50 transition">
                    <td className="p-3 border text-gray-600">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 border font-medium text-blue-700">{d.organizationName}</td>
                    <td className="p-3 border text-gray-600 capitalize">{d.type}</td>
                    <td className="p-3 border text-gray-600">
                      {d.type === "monetary" ? `₹${d.amount}` : `${d.item} (${d.quantity})`}
                    </td>
                    <td
                      className={`p-3 border font-semibold ${
                        d.status === "completed"
                          ? "text-green-600"
                          : d.status === "failed"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {d.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
