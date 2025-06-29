// src/components/ApplicationCard.jsx

import React from "react";
import API from "../api/axios";

 function ApplicationCard({ application, showHireButton = false, onHire = null }) {
  const handleHire = async () => {
    try {
      await API.patch(`/applications/${application.id}/hire`);
      alert("Freelancer hired!");
      if (onHire) onHire();
    } catch (err) {
      console.error(err);
      alert("Failed to hire freelancer");
    }
  };

  if (!application) {
    return <div className="text-red-500">Application data is missing.</div>;
  }

  return (
    <div className="border p-4 mb-4 rounded shadow bg-white">
      <p><strong>Freelancer ID:</strong> {application.freelancer_id}</p>
      <p><strong>Message:</strong> {application.message}</p>
      <p><strong>Status:</strong>
        <span className={`ml-2 font-semibold ${application.status === "pending" ? "text-yellow-600" : "text-green-600"}`}>
          {application.status}
        </span>
      </p>

      {showHireButton && application.status === "pending" && (
        <button
          onClick={handleHire}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Hire Freelancer
        </button>
      )}
    </div>
  );
}
export default ApplicationCard;