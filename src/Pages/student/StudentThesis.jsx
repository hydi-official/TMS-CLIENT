import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Search, 
  Eye, 
  Mail, 
  Phone, 
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  FileText,
  Users,
  TrendingUp,
  Award,
  Target,
  Activity
} from 'lucide-react';

const StudentThesis = () => {
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://tms-backend-8gdz.onrender.com';

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Function to get user initials
  const getUserInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Function to generate a consistent color based on the name
  const getInitialsColor = (fullName) => {
    if (!fullName) return 'bg-gray-500';
    
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Profile Picture Component
  const ProfilePicture = ({ src, name, size = 'w-12 h-12', textSize = 'text-sm' }) => {
    const initials = getUserInitials(name);
    const bgColor = getInitialsColor(name);
    
    if (src) {
      return (
        <img
          src={src}
          alt="Profile"
          className={`${size} rounded-full object-cover bg-gray-200 border-2 border-white shadow-sm`}
        />
      );
    }
    
    return (
      <div className={`${size} rounded-full ${bgColor} flex items-center justify-center border-2 border-white shadow-sm`}>
        <span className={`${textSize} font-semibold text-white`}>
          {initials}
        </span>
      </div>
    );
  };

  // Fetch thesis data
  const fetchThesis = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to access your thesis');
        return;
      }

      const response = await fetch(`${BASE_URL}/thesis/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        // For student, we expect either a single thesis or an array with one thesis
        const studentThesis = Array.isArray(data) ? data[0] : data;
        setThesis(studentThesis);
      } else if (response.status === 404) {
        setThesis(null);
        setError(null);
      } else {
        setError('Failed to fetch thesis data');
      }
    } catch (error) {
      console.error('Error fetching thesis:', error);
      setError('Error loading thesis data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThesis();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'on-hold':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'proposal':
        return 'bg-yellow-100 text-yellow-800';
      case 'research':
        return 'bg-blue-100 text-blue-800';
      case 'writing':
        return 'bg-purple-100 text-purple-800';
      case 'review':
        return 'bg-orange-100 text-orange-800';
      case 'defense':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = () => {
    setSelectedThesis(thesis);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedThesis(null);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressMessage = (progress, stage) => {
    if (progress === 0) return 'Getting started on your thesis journey';
    if (progress < 25) return 'In the early stages of your research';
    if (progress < 50) return 'Making steady progress on your work';
    if (progress < 75) return 'Well on your way to completion';
    if (progress < 100) return 'Nearing the finish line!';
    return 'Congratulations on completing your thesis!';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your thesis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Thesis</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!thesis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <BookOpen className="mx-auto h-24 w-24 text-gray-400" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">No Thesis Found</h3>
          <p className="mt-2 text-gray-600">
            You don't have an active thesis yet. Contact your academic advisor to get started on your thesis journey.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Thesis</h1>
          <p className="text-gray-600">Track your thesis progress and view important details</p>
        </div>

        {/* Main Thesis Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {thesis.title || 'Untitled Thesis'}
                </h2>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Started: {formatDate(thesis.startDate)}
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Stage: {thesis.student?.currentStage || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">
                  {thesis.student?.progress || 0}%
                </div>
                <div className="text-blue-100 text-sm">Complete</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(thesis.status)}`}>
                  {getStatusIcon(thesis.status)}
                  {thesis.status?.replace('-', ' ')}
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ${getProgressColor(thesis.student?.progress || 0)}`}
                    style={{ width: `${thesis.student?.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-center">
                  {getProgressMessage(thesis.student?.progress || 0, thesis.student?.currentStage)}
                </p>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Thesis Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Thesis Details
                </h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Research Topic</p>
                    <p className="font-medium text-gray-900">
                      {thesis.student?.thesisTopic || 'Topic not specified'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Current Stage</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getStageColor(thesis.student?.currentStage)}`}>
                      {thesis.student?.currentStage || 'Not specified'}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Student ID</p>
                    <p className="font-medium text-gray-900">{thesis.student?.studentId}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Thesis ID</p>
                    <p className="font-mono text-sm text-gray-600">{thesis._id}</p>
                  </div>
                </div>
              </div>

              {/* Supervisor Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Supervisor
                </h4>
                {thesis.supervisor ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <ProfilePicture
                        src={thesis.supervisor.user?.profilePicture?.url}
                        name={thesis.supervisor.user?.fullName}
                        size="w-16 h-16"
                        textSize="text-lg"
                      />
                      <div>
                        <h5 className="text-xl font-medium text-gray-900">
                          {thesis.supervisor.user?.fullName}
                        </h5>
                        <p className="text-gray-600">{thesis.supervisor.department}</p>
                        <p className="text-sm text-gray-500">Staff ID: {thesis.supervisor.staffId}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-3" />
                        <span>{thesis.supervisor.user?.email}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-3" />
                        <span>Research Area: {thesis.supervisor.researchArea}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-3" />
                        <span>
                          Supervising: {thesis.supervisor.currentStudents}/{thesis.supervisor.maxStudents} students
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Activity className="w-4 h-4 mr-3" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          thesis.supervisor.isAcceptingStudents 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {thesis.supervisor.isAcceptingStudents ? 'Accepting Students' : 'Not Accepting'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                      <p className="text-yellow-800">No supervisor assigned yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supervisor Requests History */}
            {thesis.student?.requestedSupervisors && thesis.student.requestedSupervisors.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Supervisor Request History
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {thesis.student.requestedSupervisors.map((request, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <div>
                            <p className="font-medium">Supervisor Request {index + 1}</p>
                            <p className="text-sm text-gray-500">
                              Requested on {formatDate(request.requestedAt)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleViewDetails}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Eye className="w-5 h-5" />
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedThesis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900">Complete Thesis Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Thesis Overview */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Thesis Overview</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Title</p>
                      <p className="text-lg font-medium text-gray-900">{selectedThesis.title || 'Untitled Thesis'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedThesis.status)}`}>
                        {getStatusIcon(selectedThesis.status)}
                        {selectedThesis.status?.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Research Topic</p>
                      <p className="text-gray-900">{selectedThesis.student?.thesisTopic || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Start Date</p>
                      <p className="text-gray-900">{formatDate(selectedThesis.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Current Stage</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getStageColor(selectedThesis.student?.currentStage)}`}>
                        {selectedThesis.student?.currentStage || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Progress</p>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(selectedThesis.student?.progress || 0)}`}
                            style={{ width: `${selectedThesis.student?.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedThesis.student?.progress || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                      <p className="text-gray-900">{selectedThesis.student?.user?.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Student ID</p>
                      <p className="text-gray-900">{selectedThesis.student?.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                      <p className="text-gray-900">{selectedThesis.student?.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Registration Date</p>
                      <p className="text-gray-900">{formatDate(selectedThesis.student?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Supervisor Information */}
              {selectedThesis.supervisor && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Supervisor Details</h4>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <ProfilePicture
                        src={selectedThesis.supervisor.user?.profilePicture?.url}
                        name={selectedThesis.supervisor.user?.fullName}
                        size="w-20 h-20"
                        textSize="text-xl"
                      />
                      <div>
                        <h5 className="text-2xl font-semibold text-gray-900">
                          {selectedThesis.supervisor.user?.fullName}
                        </h5>
                        <p className="text-gray-600 text-lg">{selectedThesis.supervisor.department}</p>
                        <p className="text-gray-500">Staff ID: {selectedThesis.supervisor.staffId}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                        <p className="text-gray-900">{selectedThesis.supervisor.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Research Area</p>
                        <p className="text-gray-900">{selectedThesis.supervisor.researchArea}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Current Students</p>
                        <p className="text-gray-900">
                          {selectedThesis.supervisor.currentStudents} / {selectedThesis.supervisor.maxStudents}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Accepting New Students</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                          selectedThesis.supervisor.isAcceptingStudents 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedThesis.supervisor.isAcceptingStudents ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">Thesis Started</p>
                        <p className="text-sm text-gray-500">{formatDate(selectedThesis.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-500">{formatDate(selectedThesis.updatedAt)}</p>
                      </div>
                    </div>

                    {selectedThesis.student?.requestedSupervisors?.map((request, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          request.status === 'accepted' ? 'bg-green-500' :
                          request.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Supervisor Request {index + 1} - {request.status}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(request.requestedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentThesis;