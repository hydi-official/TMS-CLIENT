import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserPlus, 
  GraduationCap, 
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  ChevronDown,
  Eye,
  User,
  Shield,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState({ students: [], lecturers: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const BASE_URL = 'https://tms-backend-8gdz.onrender.com/api';

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const [studentsResponse, lecturersResponse] = await Promise.allSettled([
        fetch(`${BASE_URL}/users/students`, { headers }),
        fetch(`${BASE_URL}/users/lecturers`, { headers })
      ]);

      let students = [];
      let lecturers = [];

      if (studentsResponse.status === 'fulfilled' && studentsResponse.value.ok) {
        students = await studentsResponse.value.json();
      }

      if (lecturersResponse.status === 'fulfilled' && lecturersResponse.value.ok) {
        lecturers = await lecturersResponse.value.json();
      }

      setUsers({ students: Array.isArray(students) ? students : [], lecturers: Array.isArray(lecturers) ? lecturers : [] });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and status
  const getFilteredUsers = () => {
    const currentUsers = activeTab === 'students' ? users.students : users.lecturers;
    
    return currentUsers.filter(user => {
      const matchesSearch = user.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (activeTab === 'students' ? user.studentId : user.staffId).toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'all') return matchesSearch;
      
      if (activeTab === 'students') {
        if (filterStatus === 'active') return matchesSearch && user.supervisor;
        if (filterStatus === 'inactive') return matchesSearch && !user.supervisor;
      } else {
        if (filterStatus === 'active') return matchesSearch && user.isAcceptingStudents;
        if (filterStatus === 'inactive') return matchesSearch && !user.isAcceptingStudents;
      }
      
      return matchesSearch;
    });
  };

  const filteredUsers = getFilteredUsers();

  // Handle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  // Handle view user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    setShowDropdown(null);
  };

  // Get user stats
  const getStats = () => {
    const totalStudents = users.students.length;
    const totalLecturers = users.lecturers.length;
    const activeStudents = users.students.filter(s => s.supervisor).length;
    const activeLecturers = users.lecturers.filter(l => l.isAcceptingStudents).length;

    return {
      totalStudents,
      totalLecturers,
      activeStudents,
      activeLecturers,
      totalUsers: totalStudents + totalLecturers
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">Manage students and lecturers in the system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lecturers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLecturers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-red-500 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Lecturers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeLecturers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="h-4 w-4 inline mr-2" />
                Students ({users.students.length})
              </button>
              <button
                onClick={() => setActiveTab('lecturers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'lecturers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="h-4 w-4 inline mr-2" />
                Lecturers ({users.lecturers.length})
              </button>
            </nav>
          </div>

          {/* Controls */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {selectedUsers.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {selectedUsers.length} selected
                  </span>
                )}
                <Link to={activeTab === 'students' ? '/admin/add-student' : '/admin/add-lecturer'}>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add {activeTab === 'students' ? 'Student' : 'Lecturer'}
                </button>
                </Link>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={selectAllUsers}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  {activeTab === 'students' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supervisor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Research Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.user.profilePicture?.url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.user.profilePicture.url}
                              alt="Profile"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activeTab === 'students' ? user.studentId : user.staffId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.user.department}
                    </td>
                    {activeTab === 'students' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.supervisor ? user.supervisor.user.fullName : 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.currentStage || 'Not started'}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.researchArea}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.currentStudents}/{user.maxStudents}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activeTab === 'students'
                          ? user.supervisor 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                          : user.isAcceptingStudents
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {activeTab === 'students'
                          ? user.supervisor ? 'Active' : 'Inactive'
                          : user.isAcceptingStudents ? 'Accepting' : 'Not Accepting'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === user._id ? null : user._id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showDropdown === user._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button 
                                onClick={() => viewUserDetails(user)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                              <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                              <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : `No ${activeTab} have been added yet`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === 'students' ? 'Student' : 'Lecturer'} Details
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0">
                  {selectedUser.user.profilePicture?.url ? (
                    <img
                      className="h-20 w-20 rounded-full object-cover"
                      src={selectedUser.user.profilePicture.url}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedUser.user.fullName}</h4>
                  <p className="text-gray-600">{selectedUser.user.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    activeTab === 'students'
                      ? selectedUser.supervisor 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                      : selectedUser.isAcceptingStudents
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {activeTab === 'students'
                      ? selectedUser.supervisor ? 'Active' : 'Inactive'
                      : selectedUser.isAcceptingStudents ? 'Accepting Students' : 'Not Accepting'
                    }
                  </span>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">BASIC INFORMATION</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">ID:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {activeTab === 'students' ? selectedUser.studentId : selectedUser.staffId}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">{selectedUser.user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Department:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">{selectedUser.user.department}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Joined:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role Specific Information */}
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">
                    {activeTab === 'students' ? 'ACADEMIC INFORMATION' : 'LECTURER INFORMATION'}
                  </h5>
                  <div className="space-y-3">
                    {activeTab === 'students' ? (
                      <>
                        <div className="flex items-start">
                          <GraduationCap className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <span className="text-sm text-gray-600">Current Stage:</span>
                            <div className="text-sm font-medium text-gray-900">
                              {selectedUser.currentStage ? 
                                selectedUser.currentStage.charAt(0).toUpperCase() + selectedUser.currentStage.slice(1) : 
                                'Not started'
                              }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <UserCheck className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <span className="text-sm text-gray-600">Supervisor:</span>
                            <div className="text-sm font-medium text-gray-900">
                              {selectedUser.supervisor ? selectedUser.supervisor.user.fullName : 'Not assigned'}
                            </div>
                            {selectedUser.supervisor && (
                              <div className="text-xs text-gray-500">
                                {selectedUser.supervisor.researchArea}
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedUser.thesisTopic && (
                          <div className="flex items-start">
                            <BookOpen className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <span className="text-sm text-gray-600">Thesis Topic:</span>
                              <div className="text-sm font-medium text-gray-900">{selectedUser.thesisTopic}</div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">Progress:</span>
                          <span className="text-sm font-medium text-gray-900 ml-2">{selectedUser.progress || 0}%</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <span className="text-sm text-gray-600">Research Area:</span>
                            <div className="text-sm font-medium text-gray-900">{selectedUser.researchArea}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">Student Capacity:</span>
                          <span className="text-sm font-medium text-gray-900 ml-2">
                            {selectedUser.currentStudents} / {selectedUser.maxStudents}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">Accepting Students:</span>
                          <span className={`text-sm font-medium ml-2 ${
                            selectedUser.isAcceptingStudents ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedUser.isAcceptingStudents ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details for Students */}
              {activeTab === 'students' && selectedUser.requestedSupervisors && selectedUser.requestedSupervisors.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-500 mb-3">SUPERVISOR REQUESTS</h5>
                  <div className="space-y-2">
                    {selectedUser.requestedSupervisors.map((request, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Request #{index + 1}</span>
                          <div className="text-xs text-gray-500">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Edit className="h-4 w-4 inline mr-2" />
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click away handler for dropdowns */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(null)}
        />
      )}
    </div>
  );
};

export default ManageUsers;