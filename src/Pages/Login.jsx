import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [userId, setUserId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Access environment variable or fallback to localhost
  const BASE_URL = import.meta.env.VITE_BASE_URL ;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        userId,
        pin
      });

      const { data } = response;
      
      // Store token in localStorage (or consider using httpOnly cookies for better security)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      console.log("Login Success:", data);

      // Route based on user role
      const userRole = data.role;
      switch (userRole) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "lecturer":
          navigate("/lecturer/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          setError("Unknown user role");
          break;
      }

    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`p-2 rounded-lg text-white transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;