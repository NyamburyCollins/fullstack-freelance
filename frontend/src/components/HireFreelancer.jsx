

import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

 function HireFreelancer() {
  const [freelancers, setFreelancers] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    API.get("/freelancers")
      .then((res) => setFreelancers(res.data))
      .catch((err) => console.error(" Failed to fetch freelancers:", err));

    API.get("/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(" Failed to fetch services:", err));
  }, []);

  useEffect(() => {
    const match = services.find(
      (s) => s.title.toLowerCase() === searchTitle.toLowerCase()
    );
    setSelectedService(match || null);
  }, [searchTitle, services]);

  const handleHire = async (freelancerId) => {
    if (!selectedService) {
      alert("Enter a valid service title first!");
      return;
    }

    try {
      await API.post(
        `/services/${selectedService.id}/apply`,
        {
          message: `Interested in working on "${selectedService.title}"!`,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      alert(" Freelancer hired!");
    } catch (err) {
      console.error(" Hiring failed:", err.response?.data || err.message);
      alert("Failed to hire freelancer.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Hire Freelancer by Project</h2>

      <div className="mb-6">
        <label className="block font-medium mb-2">Enter project title:</label>
        <input
          type="text"
          placeholder="e.g. Website Design"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        {searchTitle && !selectedService && (
          <p className="text-red-500 mt-1">❌ No matching service found.</p>
        )}
        {selectedService && (
          <p className="text-green-600 mt-1">
            ✅ Matched Service: <strong>{selectedService.title}</strong>
          </p>
        )}
      </div>

      {freelancers.length === 0 ? (
        <p>No freelancers found.</p>
      ) : (
        freelancers.map((freelancer) => (
          <div
            key={freelancer.id}
            className="bg-white shadow rounded p-4 mb-4 border"
          >
            <h3 className="text-xl font-bold">{freelancer.username}</h3>
            <p className="text-gray-700">{freelancer.bio}</p>
            <button
              onClick={() => handleHire(freelancer.id)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Hire for "{selectedService?.title || '...'}"
            </button>
          </div>
        ))
      )}
    </div>
  );
}
export default HireFreelancer;