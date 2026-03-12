import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import DonationTrackingEditor from "../components/DonationTrackingEditor";

export default function OrgDashboard() {
  const [wishlist, setWishlist] = useState([]);
  const [newItem, setNewItem] = useState({ item: "", quantity: "" });
  const [org, setOrg] = useState(null);
  const [donations, setDonations] = useState([]);
  const token = localStorage.getItem("token");
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // 🔹 Fetch organization data + donations
  const fetchOrg = React.useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/organizations/dashboard/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrg(res.data);
      setWishlist(res.data.wishlist || []);
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error("Error fetching org data:", err);
      alert("Error loading organization data");
    }
  }, [token]);

  useEffect(() => {
    fetchOrg();

    // Optional: Auto-refresh donations every 15s
    const interval = setInterval(fetchOrg, 15000);
    return () => clearInterval(interval);
  }, [token, fetchOrg]);

  // 🔹 Add new wishlist item
  const handleAddItem = () => {
    if (!newItem.item || !newItem.quantity)
      return alert("Please enter both item and quantity");
    setWishlist([...wishlist, newItem]);
    setNewItem({ item: "", quantity: "" });
  };

  // 🔹 Remove wishlist item
  const handleRemoveItem = (index) => {
    setWishlist(wishlist.filter((_, i) => i !== index));
  };

  // 🔹 Save updated wishlist
  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/organizations/wishlist",
        { wishlist },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Wishlist updated successfully!");
      fetchOrg(); // refresh after save
    } catch (err) {
      console.error(err);
      alert("Failed to update wishlist");
    }
  };

  // 🔹 Donation stats
  const totalDonations = donations.length;
  const totalMoney = donations
    .filter((d) => d.type === "monetary")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  const pendingDonations = donations.filter(
    (d) => d.status === "Pending"
  ).length;
  const completedDonations = donations.filter(
    (d) => d.status === "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white text-gray-800 p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Welcome, {org?.name || "Organization"}
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your wishlist and track donations in real time.
        </p>

        {/* --- Donation Stats --- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Total Donations</p>
            <p className="text-2xl font-bold text-blue-700">
              {totalDonations}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Total Monetary (₹)</p>
            <p className="text-2xl font-bold text-green-700">
              {totalMoney}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingDonations}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-purple-600">
              {completedDonations}
            </p>
          </div>
        </div>

        {/* --- Wishlist Section --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">🛍️ Wishlist</h2>

          <div className="space-y-4">
            {wishlist.length > 0 ? (
              wishlist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center bg-sky-50 p-4 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-gray-700">{item.item}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    ✖ Remove
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No wishlist items yet.
              </p>
            )}
          </div>

          {/* Add new item */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold text-blue-600 mb-3">
              Add New Item
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Item name"
                value={newItem.item}
                onChange={(e) =>
                  setNewItem({ ...newItem, item: e.target.value })
                }
                className="border px-4 py-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                className="border px-4 py-2 rounded-lg w-32 focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={handleAddItem}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-8 bg-green-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            💾 Save Wishlist
          </button>
        </div>

        {/* --- Donations Section --- */}
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            📦 Recent Donations
          </h2>
          {donations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-left text-sm text-gray-600">
                    <th className="p-3">Donor</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount/Item</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations
                    .slice()
                    .reverse()
                    .map((don, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">
                          {don.donorName || "Anonymous"}
                        </td>
                        <td className="p-3">{don.type}</td>
                        <td className="p-3">
                          {don.type === "monetary" || don.type === "split"
  ? `₹${don.amount}`
  : don.impact || "-"}

                        </td>
                        <td
                          className={`p-3 font-semibold ${
                            don.status === "Completed"
                              ? "text-green-600"
                              : don.status === "Pending"
                              ? "text-yellow-600"
                              : "text-gray-600"
                          }`}
                        >
                          {don.status}
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(don.date).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm">
                          <button
                            onClick={async () => {
                              // Resolve a canonical Donation document _id before opening editor.
                              // Prefer donationRef if present; otherwise try to find via donor email.
                              try {
                                let resolvedId = don.donationRef || null;
                                if (!resolvedId && don.donorEmail) {
                                  const r = await axios.get(`/api/donations/donor/${encodeURIComponent(don.donorEmail)}`);
                                  const list = r.data.donations || [];
                                  const match = list.find((dd) => {
                                    try {
                                      return dd.organizationId && org && dd.organizationId.toString() === org._id?.toString() && dd.type === don.type && (don.type === 'monetary' ? Number(dd.amount) === Number(don.amount) : true);
                                    } catch (e) { return false; }
                                  });
                                  if (match) resolvedId = match._id;
                                }

                                setSelectedDonation({ ...don, resolvedDonationId: resolvedId });
                                setEditorOpen(true);
                              } catch (err) {
                                console.error('Failed to resolve donation id', err);
                                // fallback: open editor with existing subdoc id
                                setSelectedDonation(don);
                                setEditorOpen(true);
                              }
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">No donations yet.</p>
          )}
        </div>
      </motion.div>
      {editorOpen && selectedDonation && (
        <DonationTrackingEditor
          donationId={selectedDonation.resolvedDonationId || selectedDonation.donationRef || selectedDonation._id}
          organizationId={org?._id}
          organizationName={org?.name}
          token={token}
          onClose={() => { setEditorOpen(false); setSelectedDonation(null); }}
          onSaved={(tracking) => { setEditorOpen(false); setSelectedDonation(null); fetchOrg(); alert('Tracking saved'); }}
        />
      )}
    </div>
  );
}
