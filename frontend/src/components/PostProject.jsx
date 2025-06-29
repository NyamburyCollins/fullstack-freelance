

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import API from "../api/axios";
 function PostProject() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    API.get("/services", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const postedByMe = res.data.filter((s) => s.client_id === user.id);
        setMyProjects(postedByMe);
      })
      .catch((err) => {
        console.error("Failed to fetch services:", err);
        setError("Failed to fetch services.");
      })
      .finally(() => setLoading(false));
  }, [user, token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        await API.patch(`/services/${editingId}`, form, { headers });
        alert("Project updated!");
      } else {
        await API.post("/services", form, { headers });
        alert("Project posted!");
      }

      setForm({ title: "", description: "", budget: "" });
      setEditingId(null);

      const res = await API.get("/services", { headers });
      const postedByMe = res.data.filter((s) => s.client_id === user.id);
      setMyProjects(postedByMe);
    } catch (err) {
      console.error("Error saving project:", err);
      setError(err.response?.data?.error || "Failed to save project.");
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      budget: service.budget,
    });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded border shadow-md">
      <h1 className="text-xl font-bold mb-4">
        {editingId ? "Edit Project" : "Post a New Project"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="budget"
          placeholder="Budget"
          className="w-full p-2 border rounded"
          value={form.budget}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Project" : "Post Project"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      <h2 className="text-lg font-bold mb-2">Your Posted Projects</h2>
      {loading ? (
        <p>Loading...</p>
      ) : myProjects.length === 0 ? (
        <p>No projects posted yet.</p>
      ) : (
        myProjects.map((s) => (
          <div key={s.id} className="border p-2 mb-2 rounded hover:bg-gray-100">
            <strong>{s.title}</strong> — Budget: ${s.budget}
            <button
              onClick={() => handleEdit(s)}
              className="ml-4 text-blue-600 underline"
            >
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  );
}
export default PostProject;