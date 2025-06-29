import { useState, useEffect } from "react";
import API from "../api/axios";
import React from 'react';
import { useAuth } from "./AuthContext";

function Profile() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");

  useEffect(() => {
    API
      .get("/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setBio(res.data.bio || ""));
  }, [user]);

  const handleUpdate = () => {
    API
      .patch(
        "/profile",
        { bio },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => alert("Profile updated!"));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <textarea
        className="w-full border p-2 mt-2"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Save
      </button>
    </div>
  );
}

export default Profile;


