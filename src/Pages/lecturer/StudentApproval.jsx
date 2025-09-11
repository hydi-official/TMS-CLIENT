import React, { useState, useEffect } from 'react';
import { User, CheckCircle, XCircle, Clock, Mail, BookOpen, Calendar, AlertCircle } from 'lucide-react';

const StudentApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingRequest, setProcessingRequest] = useState(null);

  // Get base URL and token from login
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://tms-backend-8gdz.onrender.com';
  const token = localStorage.getItem('token');

  // Helper functions for profile images
  const getInitials = (fullName) => {
    if (!fullName) return 'N/A';
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name) => {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500',
      'bg-cyan-500'
    ];
    const index = (name || '').length % colors.length;
    return colors[index];
  };

  const ProfileImage = ({ user, size = 'w-12 h-12', textSize = 'text-lg' }) => {
    const hasImage = user?.profilePicture?.url;
    
    if (hasImage) {
      return (
        <img
          src={user.profilePicture.url}
          alt={user.fullName || 'Profile'}
          className={`${size} rounded-full object-cover border-2 border-gray-200`}
        />
      );
    }

    return (
      <div className={`${size} ${getRandomColor(user?.fullName)} rounded-full flex items-center justify-center text-white font-semibold ${textSize}`}>
        {getInitials(user?.fullName)}
      </div>
    );
  };

  // Fetch lecturer requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/users/lecturer-requests`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  // Handle accept/reject request
  const handleRequestResponse = async (studentId, status) => {
    try {
      setProcessingRequest(studentId);
      
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        studentId: studentId,
        status: status
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/users/respond-request`, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Update the local state to reflect the change
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.student._id === studentId 
            ? { ...request, status: status }
            : request
        )
      );

      // Show success message (you can customize this)
      console.log(`Request ${status} successfully`);
      
    } catch (err) {
      console.error('Failed to update request:', err);
      setError(err.message || `Failed to ${status} request`);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Load requests on component mount
  useEffect(() => {
    if (!token) {
      setError('No authentication token found. Please login again.');
      return;
    }
    fetchRequests();
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case 'accepted':
          return { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Accepted' };
        case 'rejected':
          return { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' };
        case 'pending':
        default:
          return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' };
      }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.text}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Supervision Requests</h1>
          <p className="text-gray-600">Review and respond to student supervision requests</p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Requests Found</h3>
            <p className="text-gray-500">There are currently no student supervision requests to review.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <ProfileImage user={request.student.user} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.student.user.fullName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Mail className="w-4 h-4 mr-1" />
                          {request.student.user.email}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Student ID</p>
                      <p className="font-medium text-gray-900">{request.student.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Department</p>
                      <p className="font-medium text-gray-900">{request.student.user.department}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Thesis Topic
                      </p>
                      <p className="font-medium text-gray-900">{request.student.thesisTopic}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Request Date
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(request.requestedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleRequestResponse(request.student._id, 'accepted')}
                        disabled={processingRequest === request.student._id}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {processingRequest === request.student._id ? 'Processing...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleRequestResponse(request.student._id, 'rejected')}
                        disabled={processingRequest === request.student._id}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {processingRequest === request.student._id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentApproval;