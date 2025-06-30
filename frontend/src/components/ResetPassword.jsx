
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

 function ResetPassword() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!user || !user.id) {
      return setMessage("You must be logged in to reset your password.");
    }

    if (formData.newPassword.length < 6) {
      return setMessage("Password must be at least 6 characters");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      await API.put(`/users/${user.id}/reset-password`, {
        password: formData.newPassword,
      });

      setSuccess(true);
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.error || "Failed to reset password";
      setMessage(backendError);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          className="w-full p-2 border"
          onChange={handleChange}
          value={formData.newPassword}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full p-2 border"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reset Password
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 text-sm text-center ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
export default ResetPassword;
