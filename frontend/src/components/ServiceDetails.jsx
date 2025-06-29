


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

 function ServiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/services/${id}`)
      .then((res) => setService(res.data))
      .catch((err) => {
        console.error(" Failed to fetch service:", err);
        setError("Service not found.");
      });
  }, [id]);

  const handleApply = async () => {
    if (!message.trim()) return alert("Please enter a message.");

    try {
      await API.post(
        "/applications",
        {
          freelancer_id: user.id,
          service_id: service.id,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Application sent!");
      setMessage("");
    } catch (err) {
      console.error("Application error:", err.response?.data || err.message);
      alert("Failed to apply for this job.");
    }
  };

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!service) return <p className="p-4">Loading service...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
      <p className="text-gray-700 mb-2">{service.description}</p>
      <p className="text-blue-700 font-semibold mb-4">Budget: ${service.budget}</p>

      {user?.role === "freelancer" && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-bold mb-2">Apply for this job</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to the client..."
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={handleApply}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Send Application
          </button>
        </div>
      )}
    </div>
  );
}
export default ServiceDetails;