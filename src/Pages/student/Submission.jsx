import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Eye, 
  Clock, 
  FileText, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Star,
  X,
  BookOpen,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';

const StudentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const BASE_URL = 'http://localhost:5000/api';
  
  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch student's submissions
  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/submissions/my-submissions`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
      setUserInfo(data.userInfo || null);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setError(err.message || 'Failed to load submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Submit work for a submission
  const handleSubmitWork = async (e) => {
    e.preventDefault();
    
    if (!selectedFile || !selectedSubmission) {
      setError('Please select a file to submit');
      return;
    }

    try {
      setUploading(true);
      setError("");

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const formdata = new FormData();
      formdata.append("file", selectedFile);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/submissions/${selectedSubmission._id}/submit`, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Update the submission in the list
      setSubmissions(prev => 
        prev.map(sub => 
          sub._id === selectedSubmission._id 
            ? { ...sub, ...result.submission }
            : sub
        )
      );

      // Reset form and close modal
      setSelectedFile(null);
      setShowSubmitModal(false);
      setSelectedSubmission(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      console.error('Failed to submit work:', err);
      setError(err.message || 'Failed to submit work');
    } finally {
      setUploading(false);
    }
  };

  // Utility functions
  const getStatusBadge = (status) => {
    const configs = {
      'not-submitted': { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Not Submitted' },
      'submitted': { color: 'bg-blue-100 text-blue-800', icon: FileText, text: 'Submitted' },
      'accepted': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Accepted' },
      'rejected': { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, text: 'Under Review' }
    };

    const config = configs[status] || configs['pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {config.text}
      </span>
    );
  };

  const getDeadlineStatus = (deadline, submittedAt) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const isOverdue = now > deadlineDate;
    const isSubmitted = submittedAt;
    
    const timeDiff = deadlineDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let status = 'upcoming';
    let color = 'text-green-600 bg-green-50';
    let message = `${daysLeft} days left`;

    if (isSubmitted) {
      status = 'submitted';
      color = 'text-blue-600 bg-blue-50';
      message = 'Submitted on time';
    } else if (isOverdue) {
      status = 'overdue';
      color = 'text-red-600 bg-red-50';
      message = `${Math.abs(daysLeft)} days overdue`;
    } else if (daysLeft <= 3) {
      status = 'urgent';
      color = 'text-orange-600 bg-orange-50';
      message = `${daysLeft} days left - Urgent!`;
    }

    return { status, color, message, isOverdue, isSubmitted };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Submissions</h1>
              <p className="text-gray-600">Track and submit your thesis work</p>
            </div>
            {userInfo && (
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{userInfo.name}</p>
                <p className="text-sm text-gray-600">{userInfo.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'submitted' || s.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'not-submitted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Graded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.grade !== undefined).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {submissions.map((submission) => {
            const deadlineInfo = getDeadlineStatus(submission.deadline, submission.submittedAt);
            
            return (
              <div key={submission._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {submission.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {submission.stage}
                      </span>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(submission.status)}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {submission.description}
                  </p>

                  {/* Deadline Status */}
                  <div className={`p-3 rounded-lg mb-4 ${deadlineInfo.color}`}>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{deadlineInfo.message}</span>
                    </div>
                    <p className="text-xs mt-1 opacity-75">
                      Deadline: {formatDate(submission.deadline)}
                    </p>
                  </div>

                  {/* Grade Display */}
                  {submission.grade && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-yellow-800">Grade Received</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-600 mr-1" />
                          <span className="text-lg font-bold text-yellow-900">
                            {submission.grade}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Supervisor Info */}
                  {submission.supervisor && (
                    <div className="mb-4 text-sm text-gray-600">
                      <span className="font-medium">Supervisor: </span>
                      {submission.supervisor.user?.fullName || 'Dr. Mary Lecturer'}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    
                    {submission.status === 'not-submitted' && (
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowSubmitModal(true);
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Work
                      </button>
                    )}

                    {submission.file?.url && (
                      <a
                        href={submission.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Submissions Found</h3>
            <p className="text-gray-500">Your supervisor will create submissions for you to complete.</p>
          </div>
        )}

        {/* Submit Work Modal */}
        {showSubmitModal && selectedSubmission && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Submit Your Work</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedSubmission.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitWork} className="space-y-6">
                {/* Submission Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Submission Requirements</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedSubmission.description}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Deadline:</strong> {formatDate(selectedSubmission.deadline)}
                  </p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Your File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.txt"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT up to 10MB</p>
                      {selectedFile && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmitModal(false);
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Work
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedSubmission && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Title and Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Title & Stage</h3>
                    <p className="text-lg font-semibold text-gray-900">{selectedSubmission.title}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mt-2">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {selectedSubmission.stage}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      {getStatusBadge(selectedSubmission.status)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="text-gray-900 mt-1">{selectedSubmission.description}</p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="text-gray-900">{formatDate(selectedSubmission.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
                    <p className="text-gray-900">{formatDate(selectedSubmission.deadline)}</p>
                  </div>
                  {selectedSubmission.submittedAt && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Submitted At</h3>
                      <p className="text-gray-900">{formatDate(selectedSubmission.submittedAt)}</p>
                    </div>
                  )}
                </div>

                {/* Supervisor */}
                {selectedSubmission.supervisor && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Supervisor</h3>
                    <div className="mt-1 flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {selectedSubmission.supervisor.user?.fullName || 'Dr. Mary Lecturer'}
                      </span>
                    </div>
                  </div>
                )}

                {/* File */}
                {selectedSubmission.file?.url && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Submitted File</h3>
                    <a
                      href={selectedSubmission.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      View/Download File
                    </a>
                  </div>
                )}

                {/* Grading Information */}
                {selectedSubmission.grade && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade & Feedback</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Grade</h4>
                        <div className="flex items-center mt-1">
                          <Star className="w-5 h-5 text-yellow-500 mr-1" />
                          <span className="text-2xl font-bold text-gray-900">
                            {selectedSubmission.grade}/100
                          </span>
                        </div>
                      </div>
                      {selectedSubmission.gradedAt && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Graded At</h4>
                          <p className="text-gray-900">{formatDate(selectedSubmission.gradedAt)}</p>
                        </div>
                      )}
                    </div>
                    {selectedSubmission.feedback && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
                        <div className="mt-1 p-4 bg-gray-50 rounded-md">
                          <p className="text-gray-900">{selectedSubmission.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubmissions;