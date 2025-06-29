// src/components/SidebarLayout.jsx

import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

 function SidebarLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">SkillLink</h2>
        <Link to="/dashboard" className="hover:bg-blue-700 p-2 rounded">Dashboard</Link>

        <Link to="/profile" className="hover:bg-blue-700 p-2 rounded">Profile</Link>
        <Link to="/admin" className="hover:bg-blue-700 p-2 rounded">Admin Panel</Link>
        <Link to="/postproject" className="hover:bg-blue-700 p-2 rounded">Post Project</Link>
        <Link to="/hire" className="hover:bg-blue-700 p-2 rounded">Hire Freelancer</Link>
        <Link to="/services" className="hover:bg-blue-700 p-2 rounded">Services</Link>
        <Link to="/services/1" className="hover:bg-blue-700 p-2 rounded">Service Details</Link>

        <button onClick={handleLogout} className="text-red-400 hover:text-red-600 mt-4">Logout</button>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">
          Welcome back, {user?.username || "User"} 👋
        </h1>
        <Outlet />
      </main>
    </div>
  );
}
export default SidebarLayout;