import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import leftimage from '../assets/images/leftimage.png';

const ForgotPin = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Access environment variable or fallback to localhost
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleForgotPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/forgot-pin`, {
        email,
        userId
      });

      setSuccess("Password reset instructions have been sent to your email address.");
      
      // Optionally redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      console.error("Forgot Pin Failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src={leftimage} 
          alt="Forgot Pin Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Forgot Pin Form */}
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#6B6B83' }}>
        <div className="w-full max-w-md px-8">
          {/* Lock Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="relative">
                {/* Lock body */}
                <div className="w-8 h-6 bg-gray-600 rounded-sm"></div>
                {/* Lock shackle */}
                <div className="absolute -top-3 left-1 w-6 h-4 border-2 border-gray-600 rounded-t-lg bg-transparent"></div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-white text-center mb-2">
            Forgot Password?
          </h2>
          
          <p className="text-gray-300 text-center mb-8 text-sm">
            Enter your student ID and email address to reset your password
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleForgotPin} className="space-y-6">
            {/* Student ID */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Student ID:
              </label>
              <input
                type="text"
                placeholder="Enter your Student ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-4 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address:
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full p-4 rounded-full text-black font-semibold transition-colors ${
                loading || success
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {loading ? "Sending..." : success ? "Email Sent!" : "Reset Password"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <button
              onClick={handleBackToLogin}
              className="text-gray-300 underline hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPin;