

import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { AuthProvider } from './components/AuthContext';
import { useAuth } from './components/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';

import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import ServiceDetails from './components/ServiceDetails';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import LandingPage from './components/LandingPage';
import PostProject from './components/PostProject';
import HireFreelancer from './components/HireFreelancer';
import MyApplications from './components/MyApplications';
import SidebarLayout from './components/SidebarLayout';

function AppLayout({ children }) {
  const location = useLocation();
  const hideNavbarOn = ['/', '/login', '/signup', '/reset-password'];
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="postproject" element={<PostProject />} />
        <Route path="hire" element={<HireFreelancer />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="applicationcard" element={<div>ApplicationCard Component</div>} />
        <Route path="myapplications" element={<MyApplications />} />
        <Route
  path="admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  }
/>

      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
