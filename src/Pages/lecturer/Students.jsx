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
  FileText
} from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

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
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.user?.fullName || 'Unknown'}</h3>
                        <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                      </div>
                    </div>
                    {student.thesis && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(student.thesis.status)}`}>
                        {getStatusIcon(student.thesis.status)}
                        {student.thesis.status || 'pending'}
                      </span>
                    )}
                  </div>

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
                        <span className="flex-1">{student.thesisTopic}</span>
                      </div>
                    )}
                    {student.thesis && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        {student.thesis.title || 'Untitled Thesis'}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-gray-500">
                      Joined {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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