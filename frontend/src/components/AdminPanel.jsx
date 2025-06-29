import { useState, useEffect } from "react";
import API from "../api/axios";
import React from 'react';



import { useAuth } from "./AuthContext";
 function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${user.token}` };
    API.get("/users", { headers }).then((res) => setUsers(res.data));
    API.get("/categories", { headers }).then((res) => setCategories(res.data));
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <h2 className="mt-4 font-bold">Users</h2>
      {users.map((u) => (
        <div key={u.id} className="border p-2 mb-2">
          {u.username} — {u.role}
        </div>
      ))}

      <h2 className="mt-6 font-bold">Categories</h2>
      {categories.map((c) => (
        <div key={c.id} className="border p-2 mb-2">
          {c.name}
        </div>
      ))}
    </div>
  );
}
export default AdminPanel;