import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function DonorLanding() {
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/donor-landing" },
    { name: "About Us", path: "/about" },
    { name: "Donate", path: "/donate" },
    { name: "Community", path: "/community" },
    { name: "Profile", path: "/donor-profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* 🌿 Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-blue-700 cursor-pointer"
          >
            ChariTree 🌱
          </h1>
          <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
            {navItems.map((item, i) => (
              <li
                key={i}
                onClick={() => navigate(item.path)}
                className="cursor-pointer hover:text-blue-600 transition"
              >
                {item.name}
              </li>
            ))}
            {/* Add Login button to navbar */}
            <li>
              <button
                onClick={() => navigate("/donor-login")}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
            </li>
          </ul>
          <button
            onClick={() => navigate("/")}
            className="md:hidden text-blue-700 font-semibold"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* 💙 Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center py-20 px-6"
      >
        <h2 className="text-4xl font-extrabold text-blue-700 mb-4">
          Welcome Back, Generous Soul 💙
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Your contributions make real change. Continue spreading kindness through impactful donations and community support.
        </p>

        <button
          onClick={() => navigate("/donate")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition"
        >
          Donate Now 💰
        </button>
      </motion.section>

      {/* 🌍 Community Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 py-16 px-6 text-center"
      >
        <h3 className="text-3xl font-bold text-blue-700 mb-4">
          Join Our Donor Community 🤝
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Connect with other donors, track your impact, and see how your help changes lives.
        </p>
        <button
          onClick={() => navigate("/community")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Explore Community
        </button>
      </motion.section>
    </div>
  );
}
