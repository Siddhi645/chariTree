import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";
import OrgAuthPage from "./pages/OrgAuthPage";
import OrgDashboard from "./pages/OrgDashboard";
import PaymentPage from "./pages/PaymentPage";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfile from "./pages/DonorProfile";
import DonorLoginPage from "./pages/DonorLoginPage";
import DonorSignupPage from "./pages/DonorSignupPage";
import VolunteerAuthPage from "./pages/VolunteerAuthPage";
import DonorLanding from "./pages/DonorLanding";
import VolunteerLanding from "./pages/VolunteerLanding";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Home (no navbar) */}
        <Route path="/" element={<HomePage />} />

  {/* 🙋 Donor Flow */}
  <Route path="/donor-login" element={<DonorLoginPage />} />
  <Route path="/donor-signup" element={<DonorSignupPage />} />
  <Route path="/donor-landing" element={<DonorLanding />} />
  <Route path="/donate" element={<DonatePage />} /> {/* Uses DonorNavbar internally */}
  <Route path="/donor-dashboard" element={<DonorDashboard />} />
  <Route path="/donor-profile" element={<DonorProfile />} />

        {/* 🤝 Volunteer Flow */}
        <Route path="/volunteer-login" element={<VolunteerAuthPage />} />
        <Route path="/volunteer-landing" element={<VolunteerLanding />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />

        {/* 🏢 Organization Flow */}
        <Route path="/org-login" element={<OrgAuthPage />} />
        <Route path="/org-dashboard" element={<OrgDashboard />} />

        {/* 🌍 Shared pages */}
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}
