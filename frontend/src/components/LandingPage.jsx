
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Login from './Login';
import Signup from './Signup';

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handlePostProject = () => {
    if (user) {
      navigate('/postproject');
    } else {
      setShowLogin(true);
    }
  };

  const handleHireFreelancer = () => {
    if (user) {
      navigate('/hire');
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100">
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold text-purple-700">SkillLink</h2>
        <div className="space-x-4">
          <button
            onClick={handleHireFreelancer}
            className="text-purple-700 hover:text-purple-900 font-medium"
          >
            Hire Freelancer
          </button>
          <button
            onClick={handlePostProject}
            className="text-purple-700 hover:text-purple-900 font-medium"
          >
            Post a Project
          </button>
        </div>
      </nav>

      <div className="flex flex-col justify-center items-center px-4 py-12">
        <div className="text-center max-w-xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-purple-800">Welcome to SkillLink</h1>
          <p className="text-gray-600 text-lg">
            Connect clients with skilled freelancers in a secure and fast way.
          </p>

          <div className="flex justify-center flex-wrap gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Forgot your password?{" "}
            <Link to="/reset-password" className="text-blue-600 hover:underline">
              Reset here
            </Link>
          </p>
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-3 text-red-600 font-bold text-xl"
            >
              ×
            </button>
            <Login />
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-2 right-3 text-red-600 font-bold text-xl"
            >
              ×
            </button>
            <Signup />
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
