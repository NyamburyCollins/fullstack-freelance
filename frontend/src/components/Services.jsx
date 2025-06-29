
import React from 'react';

import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

 function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    API.get("/services").then((res) => setServices(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Available Services</h1>
      {services.map((s) => (
        <Link to={`/services/${s.id}`} key={s.id}>
          <div className="border p-2 mb-2 hover:bg-gray-100">
            <strong>{s.title}</strong> — Budget: ${s.budget}
          </div>
        </Link>
      ))}
    </div>
  );
}
export default Services;