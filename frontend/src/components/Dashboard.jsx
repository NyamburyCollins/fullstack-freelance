import { useEffect, useState } from "react";
import API from "../api/axios";
import React from 'react';

import { useAuth } from "./AuthContext";

 function Dashboard() {
  const { user } = useAuth();
  const [myServices, setMyServices] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const headers = { Authorization: `Bearer ${user.token}` };

    API.get("/services", { headers }).then((res) => {
      setMyServices(res.data.filter((s) => s.client_id === user.id));
    });

    API.get("/applications", { headers }).then((res) => {
      setMyApplications(res.data);
    });
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Your Posted Services</h1>
      {myServices.map((s) => (
        <div key={s.id} className="border p-2 mb-2">
          {s.title} - {s.status}
        </div>
      ))}
      <h1 className="text-xl font-bold mt-6 mb-2">Your Applications</h1>
      {myApplications.map((a) => (
        <div key={a.id} className="border p-2 mb-2">
          Applied to service #{a.service_id} - Status: {a.status}
        </div>
      ))}
    </div>
  );
}
export default Dashboard;