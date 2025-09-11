import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  User, 
  BookOpen, 
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  FileText
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Grades = () => {
  const [gradesData, setGradesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://tms-backend-8gdz.onrender.com/api/api';

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

  // Fetch grades data
  const fetchGradesData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Please login to access your grades');
        return;
      }

      const response = await fetch(`${BASE_URL}/submissions/my-grades`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGradesData(data);
      } else {
        toast.error('Failed to fetch grades data');
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Error loading grades data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGradesData();
  }, []);

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

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!gradesData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Grades Available</h2>
          <p className="text-gray-500">Your grades will appear here once submissions are graded.</p>
        </div>
      </div>
    );
  }

  const { grades, statistics, studentInfo } = gradesData;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Grades</h1>
          <p className="text-gray-600">Track your academic performance and progress</p>
        </div>

        {/* Student Info Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{studentInfo.name}</h2>
              <p className="opacity-90">Student ID: {studentInfo.studentNumber}</p>
              <p className="opacity-90">{studentInfo.email}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{statistics.averageGrade}%</div>
              <p className="opacity-90">Overall Average</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Graded"
            value={statistics.totalGraded}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Average Grade"
            value={`${statistics.averageGrade}%`}
            icon={BarChart3}
            color="green"
          />
          <StatCard
            title="Highest Grade"
            value={statistics.highestGrade}
            icon={Trophy}
            color="yellow"
          />
          <StatCard
            title="Passed Submissions"
            value={statistics.passedSubmissions}
            icon={Award}
            color="purple"
          />
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Performance Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Passed</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">{statistics.passedSubmissions}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Failed</span>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="font-semibold">{statistics.failedSubmissions}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Grade Range</span>
                <span className="font-semibold">{statistics.lowestGrade} - {statistics.highestGrade}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
            <div className="space-y-3">
              {statistics.averageGrade >= 80 && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">Excellent Performance</span>
                  <span className="text-green-600 font-semibold">80%+ Average</span>
                </div>
              )}
              {statistics.averageGrade >= 70 && statistics.averageGrade < 80 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">Good Performance</span>
                  <span className="text-blue-600 font-semibold">70-79% Average</span>
                </div>
              )}
              {statistics.averageGrade >= 60 && statistics.averageGrade < 70 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-800 font-medium">Satisfactory Performance</span>
                  <span className="text-yellow-600 font-semibold">60-69% Average</span>
                </div>
              )}
              {statistics.averageGrade < 60 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-red-800 font-medium">Needs Improvement</span>
                  <span className="text-red-600 font-semibold">Below 60% Average</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grades List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Detailed Grades
            </h3>
          </div>

          {grades.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Grades Yet</h3>
              <p className="text-gray-500">Your graded submissions will appear here.</p>
            </div>
          ) : (
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
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supervisor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map((grade) => (
                    <tr key={grade._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{grade.title}</div>
                        <div className="text-sm text-gray-500">Due: {formatDate(grade.deadline)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {grade.stage.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getGradeColor(grade.grade)}`}>
                          {grade.grade}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(grade.status)}`}>
                          {getStatusIcon(grade.status)}
                          <span className="ml-1">{grade.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(grade.submittedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{grade.supervisor.name}</div>
                            <div className="text-sm text-gray-500">{grade.supervisor.staffId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedGrade(grade)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Grade Details Modal */}
        {selectedGrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Grade Details</h3>
                  <button
                    onClick={() => setSelectedGrade(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="space-y-6">
                  {/* Header Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-xl font-semibold">{selectedGrade.title}</h4>
                      <p className="text-gray-600 capitalize">{selectedGrade.stage.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                    <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getGradeColor(selectedGrade.grade)}`}>
                      {selectedGrade.grade}%
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Submission Status</h5>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedGrade.status)}`}>
                        {getStatusIcon(selectedGrade.status)}
                        <span className="ml-2">{selectedGrade.status}</span>
                      </span>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Supervisor</h5>
                      <p className="text-gray-900">{selectedGrade.supervisor.name}</p>
                      <p className="text-sm text-gray-600">Staff ID: {selectedGrade.supervisor.staffId}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Submitted On</h5>
                      <p className="text-gray-900">{formatDate(selectedGrade.submittedAt)}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Graded On</h5>
                      <p className="text-gray-900">{formatDate(selectedGrade.gradedAt)}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h5 className="font-medium text-gray-700 mb-2">Deadline</h5>
                      <p className="text-gray-900">{formatDate(selectedGrade.deadline)}</p>
                    </div>
                  </div>

                  {/* Feedback */}
                  {selectedGrade.feedback && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Supervisor Feedback</h5>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <p className="text-gray-700">{selectedGrade.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedGrade(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;