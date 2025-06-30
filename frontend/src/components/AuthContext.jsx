
/*import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/axios';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        API.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            setUser(res.data);
          })
          .catch(() => {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          });
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  }, [token]);

  const login = async (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    try {
      const decoded = jwtDecode(token);
      const res = await API.get('/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Login failed:", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // 👈 New

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const res = await API.get('/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          console.error('Invalid token or profile fetch failed:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false); // ✅ Always end loading
    };

    verifyToken();
  }, [token]);

  const login = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const res = await API.get('/profile', {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Login failed:", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
