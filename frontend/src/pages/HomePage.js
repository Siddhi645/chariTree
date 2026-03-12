import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white text-gray-800 flex flex-col items-center justify-center px-6 text-center">
      {/* --- Title --- */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-extrabold text-blue-700 mb-4"
      >
        Welcome to ChariTree 🌱
      </motion.h1>

      {/* --- Subtitle --- */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-700 text-lg max-w-2xl mb-10"
      >
        Connecting generous donors, dedicated volunteers, and trusted organizations —
        one act of kindness at a time.
      </motion.p>

      {/* --- Action Buttons --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid sm:grid-cols-3 gap-6 w-full max-w-3xl"
      >
        {/* Donor Button */}
        <button
          onClick={() => navigate("/donor-login")}
          className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition font-semibold text-lg"
        >
          💙 Donor Login
        </button>

        {/* Volunteer Button */}
        <button
          onClick={() => navigate("/volunteer-dashboard")}
          className="px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md transition font-semibold text-lg"
        >
          🤝 Volunteer Dashboard
        </button>

        {/* Organization Button */}
        <button
          onClick={() => navigate("/org-login")}
          className="px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-md transition font-semibold text-lg"
        >
          🏢 Organization Login
        </button>
      </motion.div>

      {/* --- Optional Footer --- */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 text-gray-500 text-sm"
      >
        Together, we grow kindness 🌿
      </motion.p>
    </div>
  );
}
