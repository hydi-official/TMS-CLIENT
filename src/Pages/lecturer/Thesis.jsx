import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Mail, 
  Phone, 
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  X,
  Save,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';

const LecturerThesisManagement = () => {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit'
  const [editFormData, setEditFormData] = useState({
    title: '',
    status: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    proposal: 0
  });

  const BASE_URL = 'http://localhost:5000/api';

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
  const ProfilePicture = ({ src, name, size = 'w-10 h-10', textSize = 'text-sm' }) => {
    const initials = getUserInitials(name);
    const bgColor = getInitialsColor(name);
    
    if (src) {
      return (
        <img
          src={src}
          alt="Profile"
          className={`${size} rounded-full object-cover bg-gray-200`}
        />
      );
    }
    
    return (
      <div className={`${size} rounded-full ${bgColor} flex items-center justify-center`}>
        <span className={`${textSize} font-semibold text-white`}>
          {initials}
        </span>
      </div>
    );
  };

  // Fetch theses data
  const fetchTheses = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('Please login to access theses data');
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
        setTheses(data);
        calculateStats(data);
      } else {
        console.error('Failed to fetch theses data');
      }
    } catch (error) {
      console.error('Error fetching theses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (thesesData) => {
    const stats = {
      total: thesesData.length,
      inProgress: thesesData.filter(t => t.status === 'in-progress').length,
      completed: thesesData.filter(t => t.status === 'completed').length,
      proposal: thesesData.filter(t => t.student?.currentStage === 'proposal').length
    };
    setStats(stats);
  };

  // Update thesis
  const updateThesis = async (thesisId, updateData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/thesis/${thesisId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedThesis = await response.json();
        setTheses(prev => prev.map(t => t._id === thesisId ? updatedThesis : t));
        console.log('Thesis updated successfully!');
        setShowModal(false);
        setSelectedThesis(null);
        return true;
      } else {
        const errorData = await response.json();
        console.error(errorData.message || 'Failed to update thesis');
        return false;
      }
    } catch (error) {
      console.error('Error updating thesis:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  // Filter theses based on search term and status
  const filteredTheses = theses.filter(thesis => {
    const matchesSearch = thesis.student?.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thesis.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thesis.student?.studentId?.includes(searchTerm) ||
                         thesis.student?.thesisTopic?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || thesis.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewThesis = (thesis) => {
    setSelectedThesis(thesis);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditThesis = (thesis) => {
    setSelectedThesis(thesis);
    setEditFormData({
      title: thesis.title || '',
      status: thesis.status || 'in-progress'
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (selectedThesis) {
      const success = await updateThesis(selectedThesis._id, editFormData);
      if (success) {
        // Refresh the data
        fetchTheses();
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedThesis(null);
    setEditFormData({ title: '', status: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thesis Management</h1>
          <p className="text-gray-600">Manage and monitor student theses under your supervision</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Theses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Proposals</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.proposal}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name, thesis title, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Theses List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Theses ({filteredTheses.length})
            </h2>
          </div>

          {filteredTheses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No theses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You don\'t have any student theses yet.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTheses.map((thesis) => (
                <div key={thesis._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <ProfilePicture
                        src={thesis.student?.user?.profilePicture?.url}
                        name={thesis.student?.user?.fullName}
                        size="w-12 h-12"
                        textSize="text-sm"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {thesis.title || 'Untitled Thesis'}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(thesis.status)}`}>
                            {getStatusIcon(thesis.status)}
                            {thesis.status.replace('-', ' ')}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span className="font-medium">{thesis.student?.user?.fullName}</span>
                            <span className="mx-2">•</span>
                            <span>ID: {thesis.student?.studentId}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{thesis.student?.user?.email}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            <span>Topic: {thesis.student?.thesisTopic || 'Not specified'}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Started: {formatDate(thesis.startDate)}</span>
                            <span className="mx-4">•</span>
                            <span>Stage: {thesis.student?.currentStage || 'N/A'}</span>
                            <span className="mx-4">•</span>
                            <span>Progress: {thesis.student?.progress || 0}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${thesis.student?.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewThesis(thesis)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditThesis(thesis)}
                        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedThesis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">
                {modalType === 'view' ? 'Thesis Details' : 'Edit Thesis'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {modalType === 'view' ? (
                <div className="space-y-6">
                  {/* Student Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Student Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <ProfilePicture
                          src={selectedThesis.student?.user?.profilePicture?.url}
                          name={selectedThesis.student?.user?.fullName}
                          size="w-16 h-16"
                          textSize="text-lg"
                        />
                        <div>
                          <h5 className="text-xl font-medium text-gray-900">
                            {selectedThesis.student?.user?.fullName}
                          </h5>
                          <p className="text-gray-600">ID: {selectedThesis.student?.studentId}</p>
                          <p className="text-gray-600">{selectedThesis.student?.user?.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Current Stage</p>
                          <p className="font-medium">{selectedThesis.student?.currentStage || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Progress</p>
                          <p className="font-medium">{selectedThesis.student?.progress || 0}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thesis Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Thesis Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Title</p>
                          <p className="font-medium">{selectedThesis.title || 'Untitled Thesis'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedThesis.status)}`}>
                            {getStatusIcon(selectedThesis.status)}
                            {selectedThesis.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Research Topic</p>
                          <p className="font-medium">{selectedThesis.student?.thesisTopic || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="font-medium">{formatDate(selectedThesis.startDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supervisor Requests */}
                  {selectedThesis.student?.requestedSupervisors && selectedThesis.student.requestedSupervisors.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Supervisor Requests</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          {selectedThesis.student.requestedSupervisors.map((request, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-gray-600">Request {index + 1}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thesis Title
                    </label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter thesis title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerThesisManagement;