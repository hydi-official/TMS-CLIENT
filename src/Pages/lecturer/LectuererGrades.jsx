import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  Mail, 
  BookOpen, 
  Trophy,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  FileText,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const LecturerGrades = () => {
  const [studentsData, setStudentsData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentGradeReport, setStudentGradeReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradeReportLoading, setGradeReportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://tms-backend-8gdz.onrender.com';

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

  // Fetch students data
  const fetchStudentsData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Please login to access student data');
        return;
      }

      const response = await fetch(`${BASE_URL}/users/my-students`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentsData(data);
      } else {
        toast.error('Failed to fetch students data');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error loading students data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual student grade report
  const fetchStudentGradeReport = async (studentId) => {
    setGradeReportLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/submissions/grade-report/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentGradeReport(data);
      } else {
        toast.error('Failed to fetch student grade report');
      }
    } catch (error) {
      console.error('Error fetching grade report:', error);
      toast.error('Error loading grade report');
    } finally {
      setGradeReportLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const handleViewStudentGrades = (student) => {
    setSelectedStudent(student);
    fetchStudentGradeReport(student._id);
  };

  const handleBackToStudents = () => {
    setSelectedStudent(null);
    setStudentGradeReport(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade) => {
    if (grade >= 80) return 'text-green-600 bg-green-100';
    if (grade >= 70) return 'text-blue-600 bg-blue-100';
    if (grade >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'not-submitted':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Filter students based on search and status
  const filteredStudents = studentsData?.students.filter(student => {
    const matchesSearch = student.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && student.thesis?.status === 'in-progress';
    if (filterStatus === 'completed') return matchesSearch && student.thesis?.status === 'completed';
    
    return matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Student Grade Report View
  if (selectedStudent && studentGradeReport) {
    const { student, statistics, submissions, gradedSubmissions } = studentGradeReport;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToStudents}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Students
          </button>

          {/* Student Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ProfilePicture
                  src={selectedStudent.user.profilePicture?.url}
                  name={selectedStudent.user.fullName}
                  size="w-20 h-20"
                  textSize="text-xl"
                />
                <div>
                  <h2 className="text-3xl font-bold">{student.name}</h2>
                  <p className="opacity-90">Student ID: {student.studentId}</p>
                  <p className="opacity-90">{student.email}</p>
                  <p className="opacity-90">{student.department}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{statistics.averageGrade}%</div>
                <p className="opacity-90">Overall Average</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Submissions</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.totalSubmissions}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Graded</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.gradedSubmissions}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.pendingSubmissions}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.completionRate}%</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Student Submissions</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{submission.title}</div>
                        {submission.feedback && (
                          <div className="text-sm text-gray-500">Feedback: {submission.feedback}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {submission.stage.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1">{submission.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.grade ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getGradeColor(submission.grade)}`}>
                            {submission.grade}%
                          </span>
                        ) : (
                          <span className="text-gray-400">Not graded</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.deadline)}
                        {submission.isOverdue && (
                          <span className="ml-2 text-red-600 text-xs">(Overdue)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.submittedAt ? formatDate(submission.submittedAt) : 'Not submitted'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Students List View
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Grades Management</h1>
          <p className="text-gray-600">Manage and review grades for your supervised students</p>
        </div>

        {/* Lecturer Info Banner */}
        {studentsData?.lecturer && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center gap-4">
              <ProfilePicture
                src={studentsData.lecturer.profilePicture?.url}
                name={studentsData.lecturer.name}
                size="w-20 h-20"
                textSize="text-xl"
              />
              <div>
                <h2 className="text-2xl font-bold">{studentsData.lecturer.name}</h2>
                <p className="opacity-90">Staff ID: {studentsData.lecturer.staffId}</p>
                <p className="opacity-90">{studentsData.lecturer.department}</p>
                <p className="opacity-90">Research Area: {studentsData.lecturer.researchArea}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold">{studentsData.count}</div>
                <p className="opacity-90">Supervised Students</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Students</option>
                <option value="active">Active Thesis</option>
                <option value="completed">Completed Thesis</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <ProfilePicture
                    src={student.user.profilePicture?.url}
                    name={student.user.fullName}
                    size="w-16 h-16"
                    textSize="text-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{student.user.fullName}</h3>
                    <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                    <p className="text-sm text-gray-600">{student.user.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Department</span>
                    <span className="text-sm font-medium">{student.user.department}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Thesis Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      student.thesis?.status === 'in-progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : student.thesis?.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {student.thesis?.status || 'Not started'}
                    </span>
                  </div>

                  {student.thesisTopic && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Thesis Topic:</span>
                      <p className="text-sm font-medium mt-1">{student.thesisTopic}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Enrolled</span>
                    <span className="text-sm font-medium">{formatDate(student.createdAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewStudentGrades(student)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Grades
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Students Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'You have no supervised students yet.'
              }
            </p>
          </div>
        )}

        {/* Loading State for Grade Report */}
        {gradeReportLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading grade report...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerGrades;