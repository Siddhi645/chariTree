import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: "/", label: "Home" },
    { path: "/donate", label: "Donate" },
    { path: "/payment", label: "Payment" },
    { path: "/donor-dashboard", label: "Donor Dashboard" },
    { path: "/org-login", label: "Organization" },
  ];

  return (
    <header className="bg-gradient-to-r from-sky-200 via-white to-sky-200 shadow-xl backdrop-blur-lg bg-opacity-70 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center rounded-2xl">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-blue-700 tracking-tight hover:text-blue-900 transition duration-300 drop-shadow-lg"
        >
          ChariTree 🌱
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-10 text-gray-700 font-medium">
          {links.map((link) => (
            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.97 }}
              key={link.path}
            >
              <Link
                to={link.path}
                className={`transition duration-300 px-3 py-2 rounded-xl ${
                  location.pathname === link.path
                    ? "text-blue-700 font-semibold border-b-2 border-blue-600 bg-blue-50 shadow-md"
                    : "hover:text-blue-600 hover:bg-blue-100"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-blue-700 bg-white rounded-full shadow-lg hover:bg-blue-100 transition duration-300"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/80 backdrop-blur-lg border-t border-blue-100 shadow-2xl rounded-b-2xl"
          >
            <ul className="flex flex-col items-center py-6 gap-6 text-gray-700 font-medium">
              {links.map((link) => (
                <motion.li
                  whileHover={{ scale: 1.07, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  key={link.path}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-6 py-3 rounded-xl shadow-md transition duration-300 ${
                      location.pathname === link.path
                        ? "text-blue-700 font-semibold bg-blue-50 border border-blue-200"
                        : "hover:text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
