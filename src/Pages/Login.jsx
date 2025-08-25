import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import leftimage from '../assets/images/leftimage.png'

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("student"); // Default to student
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Access environment variable or fallback to localhost
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        userId,
        pin: password, // Keep backend compatibility
        role: selectedRole // Include selected role in the request
      });

      const { data } = response;
      
      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      // Dispatch custom event to notify other components (like Sidebar) of user data update
      window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: data }));

      console.log("Login Success:", data);

      // Route based on selected role (you can also verify against data.role if needed)
      switch (selectedRole) {
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

  const handleForgotPassword = () => {
    navigate("/forgot-pin");
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError(""); // Clear any previous errors when role changes
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src={leftimage} 
          alt="Login Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#6B6B83' }}>
        <div className="w-full max-w-md px-8">
          {/* User Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full mb-1"></div>
              <div className="w-12 h-6 bg-gray-600 rounded-t-full"></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Sign in as:
              </label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={selectedRole === "student"}
                    onChange={() => handleRoleChange("student")}
                    className="mr-3 w-4 h-4 text-gray-300 focus:ring-gray-400 focus:ring-2"
                  />
                  Student
                </label>
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="lecturer"
                    checked={selectedRole === "lecturer"}
                    onChange={() => handleRoleChange("lecturer")}
                    className="mr-3 w-4 h-4 text-gray-300 focus:ring-gray-400 focus:ring-2"
                  />
                  Lecturer
                </label>
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={selectedRole === "admin"}
                    onChange={() => handleRoleChange("admin")}
                    className="mr-3 w-4 h-4 text-gray-300 focus:ring-gray-400 focus:ring-2"
                  />
                  Administrator
                </label>
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {selectedRole === "student" ? "Student ID:" : selectedRole === "lecturer" ? "Lecturer ID:" : "Admin ID:"}
              </label>
              <input
                type="text"
                placeholder={`Enter ${selectedRole === "student" ? "Student" : selectedRole === "lecturer" ? "Lecturer" : "Admin"} ID`}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-4 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password:
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-full text-black font-semibold transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {loading ? "Logging in..." : `Login as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-6">
            <button
              onClick={handleForgotPassword}
              className="text-gray-300 underline hover:text-white transition-colors"
            >
              forgot password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;