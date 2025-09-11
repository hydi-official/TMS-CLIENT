import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  GraduationCap, 
  BookOpen,
  UserCheck,
  UserX,
  ChevronDown,
  Eye,
  User,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Trash2
} from 'lucide-react';

const AssignmentPage = () => {
  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [notification, setNotification] = useState(null);

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

      let studentsData = [];
      let lecturersData = [];

      if (studentsResponse.status === 'fulfilled' && studentsResponse.value.ok) {
        studentsData = await studentsResponse.value.json();
      }

      if (lecturersResponse.status === 'fulfilled' && lecturersResponse.value.ok) {
        lecturersData = await lecturersResponse.value.json();
      }

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setLecturers(Array.isArray(lecturersData) ? lecturersData : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter students based on search term and status
  const getFilteredStudents = () => {
    return students.filter(student => {
      const matchesSearch = student.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'all') return matchesSearch;
      if (filterStatus === 'assigned') return matchesSearch && student.supervisor;
      if (filterStatus === 'unassigned') return matchesSearch && !student.supervisor;
      
      return matchesSearch;
    });
  };

  const filteredStudents = getFilteredStudents();

  // Handle student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student._id));
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle single assignment
  const handleAssignStudents = async () => {
    if (!selectedLecturer || selectedStudents.length === 0) {
      showNotification('Please select a lecturer and at least one student', 'error');
      return;
    }

    setAssignmentLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/users/assign-students`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          lecturerId: selectedLecturer,
          studentIds: selectedStudents
        })
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(`Successfully assigned ${selectedStudents.length} students`, 'success');
        
        // Reset selections
        setSelectedStudents([]);
        setSelectedLecturer('');
        setShowAssignModal(false);
        
        // Refresh data
        fetchUsers();
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to assign students', 'error');
      }
    } catch (error) {
      console.error('Error assigning students:', error);
      showNotification('Error assigning students', 'error');
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Handle batch assignments
  const handleBatchAssignments = async () => {
    if (assignments.length === 0) {
      showNotification('Please add at least one assignment', 'error');
      return;
    }

    setAssignmentLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/users/lecturer-requests`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          assignments: assignments
        })
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(`Successfully processed ${assignments.length} assignments`, 'success');
        
        // Reset assignments
        setAssignments([]);
        
        // Refresh data
        fetchUsers();
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to process assignments', 'error');
      }
    } catch (error) {
      console.error('Error processing assignments:', error);
      showNotification('Error processing assignments', 'error');
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Add new assignment to batch
  const addAssignment = () => {
    if (!selectedLecturer || selectedStudents.length === 0) {
      showNotification('Please select a lecturer and at least one student', 'error');
      return;
    }

    const newAssignment = {
      lecturerId: selectedLecturer,
      studentIds: [...selectedStudents],
      lecturer: lecturers.find(l => l._id === selectedLecturer),
      students: students.filter(s => selectedStudents.includes(s._id))
    };

    setAssignments(prev => [...prev, newAssignment]);
    setSelectedStudents([]);
    setSelectedLecturer('');
    showNotification('Assignment added to batch', 'success');
  };

  // Remove assignment from batch
  const removeAssignment = (index) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  // Get stats
  const getStats = () => {
    const totalStudents = students.length;
    const assignedStudents = students.filter(s => s.supervisor).length;
    const unassignedStudents = totalStudents - assignedStudents;
    const totalLecturers = lecturers.length;
    const availableLecturers = lecturers.filter(l => l.isAcceptingStudents && l.currentStudents < l.maxStudents).length;

    return {
      totalStudents,
      assignedStudents,
      unassignedStudents,
      totalLecturers,
      availableLecturers
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-2" /> : 
              <AlertCircle className="h-5 w-5 mr-2" />
            }
            {notification.message}
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student-Lecturer Assignments</h1>
          <p className="text-gray-600">Manage student assignments to lecturers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assignedStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-red-500 p-3 rounded-lg">
                <UserX className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unassignedStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lecturers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLecturers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableLecturers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Students</h2>
                
                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search students..."
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
                        <option value="all">All Students</option>
                        <option value="assigned">Assigned</option>
                        <option value="unassigned">Unassigned</option>
                      </select>
                      <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {selectedStudents.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {selectedStudents.length} selected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Student List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                          onChange={selectAllStudents}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Supervisor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => toggleStudentSelection(student._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {student.user.profilePicture?.url ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={student.user.profilePicture.url}
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
                                {student.user.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.user.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.supervisor ? student.supervisor.user.fullName : 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.supervisor 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.supervisor ? 'Assigned' : 'Unassigned'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'No students available for assignment'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Panel */}
          <div className="space-y-6">
            {/* Quick Assignment */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Assignment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Lecturer
                  </label>
                  <select
                    value={selectedLecturer}
                    onChange={(e) => setSelectedLecturer(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a lecturer...</option>
                    {lecturers.filter(l => l.isAcceptingStudents && l.currentStudents < l.maxStudents).map(lecturer => (
                      <option key={lecturer._id} value={lecturer._id}>
                        {lecturer.user.fullName} ({lecturer.currentStudents}/{lecturer.maxStudents})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Students ({selectedStudents.length})
                  </label>
                  <div className="text-sm text-gray-600">
                    {selectedStudents.length === 0 ? (
                      'No students selected'
                    ) : (
                      `${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''} selected`
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAssignStudents}
                    disabled={!selectedLecturer || selectedStudents.length === 0 || assignmentLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {assignmentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Assign Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={addAssignment}
                    disabled={!selectedLecturer || selectedStudents.length === 0}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Batch
                  </button>
                </div>
              </div>
            </div>

            {/* Batch Assignments */}
            {assignments.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Assignments ({assignments.length})</h3>
                
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {assignments.map((assignment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.lecturer?.user.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {assignment.studentIds.length} student{assignment.studentIds.length > 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {assignment.students?.slice(0, 2).map(s => s.user.fullName).join(', ')}
                            {assignment.students?.length > 2 && ` +${assignment.students.length - 2} more`}
                          </div>
                        </div>
                        <button
                          onClick={() => removeAssignment(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleBatchAssignments}
                  disabled={assignmentLoading}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {assignmentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Process All Assignments
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Available Lecturers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Lecturers</h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {lecturers.filter(l => l.isAcceptingStudents).map(lecturer => (
                  <div key={lecturer._id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {lecturer.user.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {lecturer.researchArea}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {lecturer.currentStudents}/{lecturer.maxStudents} students
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${
                          lecturer.currentStudents < lecturer.maxStudents 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {lecturer.currentStudents < lecturer.maxStudents ? 'Available' : 'Full'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;