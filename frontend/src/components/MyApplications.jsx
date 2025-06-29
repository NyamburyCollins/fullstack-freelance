import React, { useEffect, useState } from "react";
import API from "../api/axios";
import ApplicationCard from "./ApplicationCard";

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    API.get("/my-applications")
      .then((res) => setApps(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      {apps.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        apps.map(app => (
          <ApplicationCard key={app.id} application={app} />
        ))
      )}
    </div>
  );
}
