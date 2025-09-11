import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Eye,
  User,
  Settings,
  Bell,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalLecturers: 0,
      assignedStudents: 0,
      unassignedStudents: 0,
      activeLecturers: 0,
      pendingRequests: 0,
      completedTheses: 0,
      averageProgress: 0
    },
    trends: {
      studentsGrowth: 0,
      lecturersGrowth: 0,
      assignmentRate: 0,
      completionRate: 0
    }
  });

  const BASE_URL = 'https://tms-backend-8gdz.onrender.com/api';

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      // Fetch students and lecturers data
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

      // Calculate dashboard statistics
      const totalStudents = studentsData.length || 0;
      const totalLecturers = lecturersData.length || 0;
      const assignedStudents = studentsData.filter(s => s.supervisor).length || 0;
      const unassignedStudents = totalStudents - assignedStudents;
      const activeLecturers = lecturersData.filter(l => l.isAcceptingStudents).length || 0;
      const completedTheses = studentsData.filter(s => s.currentStage === 'completed').length || 0;
      const averageProgress = studentsData.length > 0 
        ? Math.round(studentsData.reduce((sum, s) => sum + (s.progress || 0), 0) / studentsData.length)
        : 0;

      setDashboardData({
        stats: {
          totalStudents,
          totalLecturers,
          assignedStudents,
          unassignedStudents,
          activeLecturers,
          pendingRequests: unassignedStudents,
          completedTheses,
          averageProgress
        },
        trends: {
          studentsGrowth: 8.5,
          lecturersGrowth: 2.3,
          assignmentRate: totalStudents > 0 ? Math.round((assignedStudents / totalStudents) * 100) : 0,
          completionRate: totalStudents > 0 ? Math.round((completedTheses / totalStudents) * 100) : 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const registrationData = [
    { name: 'Jan', students: 20, lecturers: 2 },
    { name: 'Feb', students: 25, lecturers: 3 },
    { name: 'Mar', students: 30, lecturers: 1 },
    { name: 'Apr', students: 28, lecturers: 4 },
    { name: 'May', students: 35, lecturers: 2 },
    { name: 'Jun', students: 42, lecturers: 5 },
    { name: 'Jul', students: 38, lecturers: 3 }
  ];

  const departmentData = [
    { name: 'Computer Science', value: 85, color: '#3B82F6' },
    { name: 'Engineering', value: 65, color: '#10B981' },
    { name: 'Business', value: 45, color: '#F59E0B' },
    { name: 'Sciences', value: 35, color: '#EF4444' },
    { name: 'Arts', value: 15, color: '#8B5CF6' }
  ];

  const progressData = [
    { stage: 'Proposal', count: 45 },
    { stage: 'Research', count: 78 },
    { stage: 'Writing', count: 65 },
    { stage: 'Review', count: 32 },
    { stage: 'Defense', count: 25 }
  ];

  const getRecentActivities = () => {
    const activities = [];
    
    // Add activities based on actual data
    if (students.length > 0) {
      const recentAssignments = students.filter(s => s.supervisor).slice(-3);
      recentAssignments.forEach((student, index) => {
        activities.push({
          id: `assignment-${index}`,
          type: 'assignment',
          message: `${student.user.fullName} assigned to ${student.supervisor.user.fullName}`,
          time: `${Math.floor(Math.random() * 60) + 1} minutes ago`,
          icon: UserCheck,
          color: 'text-green-600'
        });
      });

      // Add recent registrations
      const recentStudents = students.slice(-2);
      recentStudents.forEach((student, index) => {
        activities.push({
          id: `student-${index}`,
          type: 'registration',
          message: `New student registered: ${student.user.fullName}`,
          time: `${Math.floor(Math.random() * 120) + 30} minutes ago`,
          icon: User,
          color: 'text-blue-600'
        });
      });
    }

    // Add system activities
    activities.push({
      id: 'system-1',
      type: 'completion',
      message: `${dashboardData.stats.completedTheses} theses completed this month`,
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    });

    if (dashboardData.stats.unassignedStudents > 0) {
      activities.push({
        id: 'pending-1',
        type: 'request',
        message: `${dashboardData.stats.unassignedStudents} students awaiting supervisor assignment`,
        time: '1 hour ago',
        icon: Clock,
        color: 'text-yellow-600'
      });
    }

    return activities.slice(0, 5); // Return only first 5 activities
  };

  const quickActions = [
    { name: 'Add Student', icon: UserCheck, color: 'bg-blue-500', href: '/admin/add-student' },
    { name: 'Add Lecturer', icon: BookOpen, color: 'bg-green-500', href: '/admin/add-lecturer' },
    { name: 'Assign Students', icon: Users, color: 'bg-purple-500', href: '/admin/assignments' },
    { name: 'Manage Users', icon: Settings, color: 'bg-orange-500', href: '/admin/manage-users' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const recentActivities = getRecentActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your thesis management system.</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={dashboardData.stats.totalStudents}
            change={dashboardData.trends.studentsGrowth}
            changeType="increase"
            icon={GraduationCap}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Lecturers"
            value={dashboardData.stats.totalLecturers}
            change={dashboardData.trends.lecturersGrowth}
            changeType="increase"
            icon={BookOpen}
            color="bg-green-500"
          />
          <StatCard
            title="Assigned Students"
            value={dashboardData.stats.assignedStudents}
            change={dashboardData.trends.assignmentRate}
            changeType="increase"
            icon={UserCheck}
            color="bg-purple-500"
          />
          <StatCard
            title="Completion Rate"
            value={`${dashboardData.trends.completionRate}%`}
            change={5.2}
            changeType="increase"
            icon={CheckCircle}
            color="bg-orange-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="bg-red-500 p-2 rounded-lg">
                <UserX className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-lg font-bold text-gray-900">{dashboardData.stats.unassignedStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-lg font-bold text-gray-900">{dashboardData.stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Lecturers</p>
                <p className="text-lg font-bold text-gray-900">{dashboardData.stats.activeLecturers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="bg-teal-500 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-lg font-bold text-gray-900">{dashboardData.stats.averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Registration Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Registration Trends</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Students</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Lecturers</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="lecturers" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Students by Department</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    dataKey="value"
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Progress Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Students by Thesis Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    View all
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`${activity.color} bg-opacity-10 p-2 rounded-lg`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className={`${action.color} p-2 rounded-lg`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">{action.name}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File Storage</span>
                  <span className="flex items-center text-yellow-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Maintenance
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;