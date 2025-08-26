import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  GraduationCap, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Edit,
  Star,
  X,
  BookOpen,
  Send
} from 'lucide-react';

const SubmissionsManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    stage: 'chapter1',
    deadline: '',
    studentIds: []
  });

  const [gradeForm, setGradeForm] = useState({
    grade: '',
    feedback: '',
    status: 'pending'
  });

  // Available students
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const BASE_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Fetch students assigned to supervisor
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/users/my-students`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the data to match the expected format
      const students = data.students?.map(student => ({
        _id: student._id,
        name: student.user?.fullName,
        email: student.user?.email,
        studentId: student.studentId
      })) || [];
      
      setAvailableStudents(students);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError(`Failed to load students: ${err.message}`);
      setAvailableStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch submissions
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

      const response = await fetch(`${BASE_URL}/submissions`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setError(err.message || 'Failed to load submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Create submission
  const handleCreateSubmission = async (e) => {
    e.preventDefault();
    try {
      setProcessingAction('create');

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(createForm);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/submissions`, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Reset form and close modal
      setCreateForm({
        title: '',
        description: '',
        stage: 'chapter1',
        deadline: '',
        studentIds: []
      });
      setShowCreateModal(false);
      
      // Refresh submissions list
      fetchSubmissions();
      
    } catch (err) {
      console.error('Failed to create submission:', err);
      setError(err.message || 'Failed to create submission');
    } finally {
      setProcessingAction(null);
    }
  };

  // Grade submission
  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      setProcessingAction('grade');

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        grade: parseInt(gradeForm.grade),
        feedback: gradeForm.feedback,
        status: gradeForm.status
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${BASE_URL}/submissions/${selectedSubmission._id}/grade`, requestOptions);
      
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
      setGradeForm({
        grade: '',
        feedback: '',
        status: 'pending'
      });
      setShowGradeModal(false);
      setSelectedSubmission(null);
      
    } catch (err) {
      console.error('Failed to grade submission:', err);
      setError(err.message || 'Failed to grade submission');
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

  const getDeadlineProgress = (deadline, submittedAt) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const totalTime = deadlineDate.getTime() - new Date('2025-08-25').getTime(); // Assuming creation date
    const remainingTime = deadlineDate.getTime() - now.getTime();
    const progress = Math.max(0, Math.min(100, ((totalTime - remainingTime) / totalTime) * 100));
    
    const isOverdue = now > deadlineDate;
    const isSubmitted = submittedAt;
    
    let colorClass = 'bg-green-500';
    if (isOverdue && !isSubmitted) {
      colorClass = 'bg-red-500';
    } else if (progress > 75) {
      colorClass = 'bg-yellow-500';
    }

    return { progress, isOverdue, isSubmitted, colorClass };
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

  useEffect(() => {
    if (!token) {
      setError('No authentication token found. Please login again.');
      return;
    }
    fetchSubmissions();
    fetchStudents();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submissions Management</h1>
            <p className="text-gray-600">Manage thesis submissions and grading</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Submission
          </button>
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
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'submitted' || s.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Graded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.grade !== undefined).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student & Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => {
                  const deadlineInfo = getDeadlineProgress(submission.deadline, submission.submittedAt);
                  
                  return (
                    <tr key={submission._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.student?.user?.fullName || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500 font-semibold">
                              {submission.title}
                            </div>
                          </div>
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
                        <div className="w-full">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Deadline: {formatDate(submission.deadline)}</span>
                            {deadlineInfo.isOverdue && !deadlineInfo.isSubmitted && (
                              <span className="text-red-600 font-medium">Overdue</span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${deadlineInfo.colorClass}`}
                              style={{ width: `${deadlineInfo.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.grade ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {submission.grade}/100
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not graded</span>
                        )}
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
                          {submission.file?.url && (
                            <a
                              href={submission.file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          {(submission.status === 'submitted' || submission.status === 'pending') && (
                            <button
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setGradeForm({
                                  grade: submission.grade || '',
                                  feedback: submission.feedback || '',
                                  status: submission.status || 'pending'
                                });
                                setShowGradeModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded-md hover:bg-purple-50"
                              title="Grade Submission"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
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
              <p className="text-gray-500">Create your first submission to get started.</p>
            </div>
          )}
        </div>

        {/* Create Submission Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Submission</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    value={createForm.stage}
                    onChange={(e) => setCreateForm({...createForm, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="proposal">Proposal</option>
                    <option value="chapter1">Chapter 1</option>
                    <option value="chapter2">Chapter 2</option>
                    <option value="chapter3">Chapter 3</option>
                    <option value="final">Final Thesis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    value={createForm.deadline}
                    onChange={(e) => setCreateForm({...createForm, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Students</label>
                  {loadingStudents ? (
                    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-gray-600">Loading students...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Select All Option */}
                      <div className="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50">
                        <input
                          type="checkbox"
                          id="select-all-students"
                          checked={createForm.studentIds.length === availableStudents.length && availableStudents.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCreateForm({
                                ...createForm,
                                studentIds: availableStudents.map(student => student._id)
                              });
                            } else {
                              setCreateForm({
                                ...createForm,
                                studentIds: []
                              });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="select-all-students" className="ml-2 text-sm font-medium text-gray-700">
                          Select All Students ({availableStudents.length})
                        </label>
                      </div>

                      {/* Individual Student Selection */}
                      <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-300 rounded-md p-2">
                        {availableStudents.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-2">No students assigned</p>
                        ) : (
                          availableStudents.map(student => (
                            <div key={student._id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                              <input
                                type="checkbox"
                                id={`student-${student._id}`}
                                checked={createForm.studentIds.includes(student._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCreateForm({
                                      ...createForm,
                                      studentIds: [...createForm.studentIds, student._id]
                                    });
                                  } else {
                                    setCreateForm({
                                      ...createForm,
                                      studentIds: createForm.studentIds.filter(id => id !== student._id)
                                    });
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`student-${student._id}`} className="ml-2 flex-1">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-xs text-gray-500">{student.email} • ID: {student.studentId}</div>
                              </label>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Selected count */}
                      <div className="text-sm text-gray-600 mt-2">
                        {createForm.studentIds.length > 0 ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {createForm.studentIds.length} student{createForm.studentIds.length > 1 ? 's' : ''} selected
                          </span>
                        ) : (
                          <span className="text-red-600">Please select at least one student</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingAction === 'create' || createForm.studentIds.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
                  >
                    {processingAction === 'create' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Submission
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Student</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedSubmission.student?.user?.fullName || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedSubmission.student?.user?.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      {getStatusBadge(selectedSubmission.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="text-lg font-semibold text-gray-900">{selectedSubmission.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="text-gray-900">{selectedSubmission.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Stage</h3>
                    <p className="text-gray-900 font-medium">{selectedSubmission.stage}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="text-gray-900">{formatDate(selectedSubmission.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
                    <p className="text-gray-900">{formatDate(selectedSubmission.deadline)}</p>
                  </div>
                </div>

                {selectedSubmission.submittedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Submitted At</h3>
                    <p className="text-gray-900">{formatDate(selectedSubmission.submittedAt)}</p>
                  </div>
                )}

                {selectedSubmission.file?.url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Submitted File</h3>
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

                {selectedSubmission.grade && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Grading Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Grade</h4>
                        <div className="flex items-center mt-1">
                          <Star className="w-5 h-5 text-yellow-500 mr-1" />
                          <span className="text-xl font-bold text-gray-900">
                            {selectedSubmission.grade}/100
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Graded At</h4>
                        <p className="text-gray-900">{formatDate(selectedSubmission.gradedAt)}</p>
                      </div>
                    </div>
                    {selectedSubmission.feedback && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md">
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

        {/* Grade Modal */}
        {showGradeModal && selectedSubmission && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Grade Submission</h2>
                <button
                  onClick={() => setShowGradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleGradeSubmission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeForm.grade}
                    onChange={(e) => setGradeForm({...gradeForm, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                  <textarea
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={gradeForm.status}
                    onChange={(e) => setGradeForm({...gradeForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGradeModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingAction === 'grade'}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center"
                  >
                    {processingAction === 'grade' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Grading...
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Submit Grade
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsManagement;