import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter,
  Home,
  GraduationCap,
  Settings,
  Bell,
  User,
  Mail,
  Calendar,
  FileText,
  X,
  Phone,
  MapPin,
  Award,
} from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://tms-backend-8gdz.onrender.com';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${BASE_URL}/users/my-students`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data.students || []);
      setLecturer(data.lecturer);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeStudentModal = () => {
    setSelectedStudent(null);
    setShowModal(false);
  };

  const filteredStudents = students.filter(student =>
    student.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.includes(searchTerm) ||
    student.thesisTopic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStageProgress = (stage) => {
    const stages = {
      'proposal': 20,
      'research': 40,
      'writing': 60,
      'review': 80,
      'completed': 100
    };
    return stages[stage] || 0;
  };

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Active Theses',
      value: students.filter(s => s.thesis?.status === 'in-progress').length,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed',
      value: students.filter(s => s.thesis?.status === 'completed').length,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'This Month',
      value: students.filter(s => {
        if (!s.createdAt) return false;
        const studentDate = new Date(s.createdAt);
        const now = new Date();
        return studentDate.getMonth() === now.getMonth() && 
               studentDate.getFullYear() === now.getFullYear();
      }).length,
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-red-500 text-center mb-4">
            <Users className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Students</h3>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <button 
            onClick={fetchStudents}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
              {lecturer && (
                <p className="text-sm text-gray-600 mt-1">
                  {lecturer.name} • {lecturer.department}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students, ID, or thesis topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'No students assigned yet'}
              </p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <ProfileImage user={student.user} />
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.user?.fullName || 'Unknown'}</h3>
                        <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                      </div>
                    </div>
                    {student.currentStage && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(student.currentStage)}`}>
                        {getStatusIcon(student.currentStage)}
                        {student.currentStage}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {student.currentStage && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-purple-600 font-medium">{getStageProgress(student.currentStage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getStageProgress(student.currentStage)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {student.user?.email || 'No email'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      {student.user?.department || 'No department'}
                    </div>
                    {student.thesisTopic && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4 mt-0.5" />
                        <span className="flex-1 line-clamp-2">{student.thesisTopic}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-gray-500">
                      Joined {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => openStudentModal(student)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
              <button 
                onClick={closeStudentModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <ProfileImage 
                  user={selectedStudent.user} 
                  size="w-20 h-20" 
                  textSize="text-2xl" 
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedStudent.user?.fullName || 'Unknown'}
                  </h3>
                  <p className="text-purple-600 font-medium mb-2">
                    Student ID: {selectedStudent.studentId}
                  </p>
                  {selectedStudent.currentStage && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedStudent.currentStage)}`}>
                      {selectedStudent.currentStage}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Section */}
              {selectedStudent.currentStage && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Thesis Progress</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Current Stage: {selectedStudent.currentStage}</span>
                      <span className="text-purple-600 font-semibold">{getStageProgress(selectedStudent.currentStage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${getStageProgress(selectedStudent.currentStage)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedStudent.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{selectedStudent.user?.department || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thesis Information */}
              {selectedStudent.thesisTopic && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Thesis Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Topic</p>
                        <p className="font-medium text-gray-900">{selectedStudent.thesisTopic}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Supervisor Requests */}
              {selectedStudent.requestedSupervisors && selectedStudent.requestedSupervisors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Supervisor Requests</h4>
                  <div className="space-y-2">
                    {selectedStudent.requestedSupervisors.map((request, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="font-medium">Request #{index + 1}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Joined</p>
                      <p className="font-medium">{new Date(selectedStudent.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium">{new Date(selectedStudent.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <button className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Send Message
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-purple-600 font-medium">
            <Users className="w-5 h-5" />
            <span className="text-xs">Students</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Theses</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Notifications</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Students;