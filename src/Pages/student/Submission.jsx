import React, { useState, useEffect } from 'react';
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
  Calendar,
  BookOpen,
  X,
  Send,
  FileCheck
} from 'lucide-react';

const StudentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const BASE_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Fetch student's submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

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
      setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
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
    if (!selectedSubmission || !selectedFile) return;

    try {
      setProcessingAction('submit');
      setUploadProgress(0);

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

      // Simulate upload progress (in a real app, you'd use axios with onUploadProgress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch(
        `${BASE_URL}/submissions/${selectedSubmission._id}/submit`, 
        requestOptions
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);

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
      setUploadProgress(0);
      
    } catch (err) {
      console.error('Failed to submit work:', err);
      setError(err.message || 'Failed to submit work');
      setUploadProgress(0);
    } finally {
      setProcessingAction(null);
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getDeadlineStatus = (deadline, submittedAt) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    
    if (submittedAt) {
      return { status: 'submitted', text: 'Submitted', color: 'text-green-600' };
    }
    
    if (now > deadlineDate) {
      return { status: 'overdue', text: 'Overdue', color: 'text-red-600' };
    }
    
    // Calculate days remaining
    const daysRemaining = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 3) {
      return { status: 'urgent', text: `${daysRemaining} days left`, color: 'text-red-600' };
    } else if (daysRemaining <= 7) {
      return { status: 'approaching', text: `${daysRemaining} days left`, color: 'text-yellow-600' };
    } else {
      return { status: 'ok', text: `${daysRemaining} days left`, color: 'text-green-600' };
    }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      // Check file type (PDF preferred)
      if (!file.type.includes('pdf') && !file.type.includes('document')) {
        setError('Please upload a PDF or document file');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  useEffect(() => {
    if (!token) {
      setError('No authentication token found. Please login again.');
      return;
    }
    fetchSubmissions();
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Submissions</h1>
          <p className="text-gray-600">View and submit your thesis work</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'submitted' || s.status === 'accepted' || s.status === 'rejected').length}
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
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title & Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => {
                  const deadlineStatus = getDeadlineStatus(submission.deadline, submission.submittedAt);
                  
                  return (
                    <tr key={submission._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {submission.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {submission.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(submission.deadline)}
                        </div>
                        <div className={`text-xs font-medium ${deadlineStatus.color}`}>
                          {deadlineStatus.text}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {submission.status === 'not-submitted' && (
                            <button
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setShowSubmitModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                              title="Submit Work"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                          
                          {submission.file?.url && (
                            <a
                              href={submission.file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-900 p-1 rounded-md hover:bg-purple-50"
                              title="Download Submitted File"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {submissions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Submissions Found</h3>
              <p className="text-gray-500">You don't have any submission assignments yet.</p>
            </div>
          )}
        </div>

        {/* Submit Work Modal */}
        {showSubmitModal && selectedSubmission && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Submit Work</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedSubmission.title} - {selectedSubmission.stage}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedFile(null);
                    setUploadProgress(0);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitWork} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload your file (PDF preferred, max 10MB)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {selectedFile ? (
                        <div className="flex flex-col items-center">
                          <FileCheck className="w-12 h-12 text-green-500 mb-2" />
                          <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload progress bar */}
                {uploadProgress > 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmitModal(false);
                      setSelectedFile(null);
                      setUploadProgress(0);
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingAction === 'submit' || !selectedFile}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
                  >
                    {processingAction === 'submit' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
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
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full p-6 max-h-screen overflow-y-auto">
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
                {/* Supervisor and Status Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Supervisor</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedSubmission.supervisor?.user?.fullName || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedSubmission.supervisor?.department}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      {getStatusBadge(selectedSubmission.status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Stage</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mt-1">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {selectedSubmission.stage}
                    </span>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                    <p className="text-lg font-semibold text-gray-900">{selectedSubmission.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-gray-900">{selectedSubmission.description}</p>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="text-gray-900">{formatDate(selectedSubmission.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
                    <p className="text-gray-900">{formatDate(selectedSubmission.deadline)}</p>
                    <p className={`text-sm font-medium ${getDeadlineStatus(selectedSubmission.deadline, selectedSubmission.submittedAt).color}`}>
                      {getDeadlineStatus(selectedSubmission.deadline, selectedSubmission.submittedAt).text}
                    </p>
                  </div>
                  {selectedSubmission.submittedAt && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Submitted At</h3>
                      <p className="text-gray-900">{formatDate(selectedSubmission.submittedAt)}</p>
                    </div>
                  )}
                </div>

                {/* File and Actions */}
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

                {/* Submission Instructions */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Instructions</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
                      <li>Ensure your file is in PDF format for best compatibility</li>
                      <li>File size should not exceed 10MB</li>
                      <li>Name your file clearly (e.g., Chapter1_YourName.pdf)</li>
                      <li>Submit before the deadline to avoid penalties</li>
                      <li>You can only submit once per assignment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubmissions;