import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function DonorNavbar() {
  const location = useLocation();

  const navLinks = [
    { path: "/donor-landing", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/donate", label: "Donate" },
    { path: "/community", label: "Community" },
    { path: "/donor-profile", label: "Profile" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-100 to-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/donor-landing"
        className="text-2xl font-extrabold text-blue-700 flex items-center gap-2"
      >
        ChariTree 🌱
      </Link>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-700 font-semibold">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`hover:text-blue-600 transition ${
                location.pathname === link.path ? "text-blue-700 underline" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
