import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const org = queryParams.get("org");
  const amount = queryParams.get("amount");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-4">🎉 Payment Successful</h2>
        <p className="text-lg text-gray-700 mb-2">
          Thank you for donating <span className="font-semibold text-blue-700">₹{amount}</span> to{" "}
          <span className="font-semibold text-blue-700">{org}</span>.
        </p>
        <p className="text-gray-500 mb-6">
          Your contribution has been recorded successfully and will appear in the organization’s dashboard.
        </p>

        <button
          onClick={() => navigate("/donor-landing")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
