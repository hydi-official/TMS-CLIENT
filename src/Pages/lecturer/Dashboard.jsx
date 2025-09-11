import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Bell, 
  CheckCircle, 
  Clock, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  AlertCircle,
  TrendingUp,
  Award,
  MessageSquare,
  GraduationCap,
  Eye,
  User,
  Mail
} from 'lucide-react';

const SupervisorDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    students: [],
    announcements: [],
    notifications: [],
    submissions: [],
    requests: [],
    profileData: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BASE_URL = 'https://tms-backend-8gdz.onrender.com/api';
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to access dashboard');
        return;
      }

      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch all data concurrently
      const [studentsRes, announcementsRes, notificationsRes, submissionsRes, requestsRes, profileRes] = await Promise.all([
        fetch(`${BASE_URL}/users/my-students`, { headers }),
        fetch(`${BASE_URL}/announcements`, { headers }),
        fetch(`${BASE_URL}/notifications`, { headers }),
        fetch(`${BASE_URL}/submissions`, { headers }),
        fetch(`${BASE_URL}/users/lecturer-requests`, { headers }),
        fetch(`${BASE_URL}/users/profile`, { headers })
      ]);

      const [students, announcements, notifications, submissions, requests, profile] = await Promise.all([
        studentsRes.ok ? studentsRes.json() : { students: [] },
        announcementsRes.ok ? announcementsRes.json() : { announcements: [] },
        notificationsRes.ok ? notificationsRes.json() : [],
        submissionsRes.ok ? submissionsRes.json() : [],
        requestsRes.ok ? requestsRes.json() : { requests: [] },
        profileRes.ok ? profileRes.json() : { user: null }
      ]);

      setDashboardData({
        students: students.students || [],
        announcements: announcements.announcements || announcements,
        notifications: notifications || [],
        submissions: submissions || [],
        requests: requests.requests || [],
        profileData: profile.user
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calendar utilities
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  // Get activities for a specific date
  const getActivitiesForDate = (date) => {
    const activities = [];
    const dateStr = date.toDateString();

    // Check submissions due
    dashboardData.submissions.forEach(submission => {
      const deadlineDate = new Date(submission.deadline);
      if (deadlineDate.toDateString() === dateStr) {
        activities.push({
          type: 'deadline',
          title: `${submission.title} Due`,
          student: submission.student?.user?.fullName,
          color: 'bg-red-100 text-red-800'
        });
      }
    });

    // Check announcements
    dashboardData.announcements.forEach(announcement => {
      const announcementDate = new Date(announcement.createdAt);
      if (announcementDate.toDateString() === dateStr) {
        activities.push({
          type: 'announcement',
          title: announcement.title,
          color: 'bg-blue-100 text-blue-800'
        });
      }
    });

    return activities;
  };

  // Profile Picture Component
  const ProfilePicture = ({ user, size = 'w-10 h-10', textSize = 'text-sm' }) => {
    const getInitials = (name) => {
      if (!name) return 'U';
      return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    };

    const getColor = (name) => {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
      return colors[(name || '').length % colors.length];
    };

    if (user?.profilePicture?.url) {
      return (
        <img
          src={user.profilePicture.url}
          alt="Profile"
          className={`${size} rounded-full object-cover`}
        />
      );
    }

    return (
      <div className={`${size} ${getColor(user?.fullName)} rounded-full flex items-center justify-center text-white font-semibold ${textSize}`}>
        {getInitials(user?.fullName)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'My Students',
      value: dashboardData.students.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Pending Submissions',
      value: dashboardData.submissions.filter(s => s.status === 'submitted' || s.status === 'pending').length,
      icon: FileText,
      color: 'bg-orange-500',
      change: '+5%'
    },
    {
      title: 'Supervision Requests',
      value: dashboardData.requests.filter(r => r.status === 'pending').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Unread Notifications',
      value: dashboardData.notifications.filter(n => !n.isRead).length,
      icon: Bell,
      color: 'bg-purple-500',
      change: '-3%'
    }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const activities = getActivitiesForDate(date);
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
            isToday(date) ? 'bg-blue-50 border-blue-200' : ''
          } ${isSelected(date) ? 'bg-blue-100 border-blue-300' : ''}`}
        >
          <div className="h-full flex flex-col">
            <div className={`text-sm font-medium mb-1 ${
              isToday(date) ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {day}
            </div>
            <div className="flex-1 space-y-1 overflow-hidden">
              {activities.slice(0, 2).map((activity, index) => (
                <div
                  key={index}
                  className={`text-xs px-1 py-0.5 rounded truncate ${activity.color}`}
                  title={activity.title}
                >
                  {activity.title}
                </div>
              ))}
              {activities.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{activities.length - 2} more
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {dashboardData.profileData?.fullName || 'Supervisor'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your students today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ProfilePicture user={dashboardData.profileData} />
              <div className="text-right">
                <p className="font-medium text-gray-900">{dashboardData.profileData?.fullName}</p>
                <p className="text-sm text-gray-600">{dashboardData.profileData?.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-700">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6 space-y-4 max-h-64 overflow-y-auto">
                {dashboardData.notifications.slice(0, 5).map((notification, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bell className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {dashboardData.notifications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Create Announcement</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Create Submission</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">View All Students</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Review Requests</span>
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
              </div>
              <div className="p-6 space-y-4 max-h-64 overflow-y-auto">
                {dashboardData.submissions
                  .filter(s => new Date(s.deadline) > new Date())
                  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                  .slice(0, 5)
                  .map((submission, index) => {
                    const daysUntil = Math.ceil((new Date(submission.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          daysUntil <= 3 ? 'bg-red-100' : daysUntil <= 7 ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <Clock className={`w-4 h-4 ${
                            daysUntil <= 3 ? 'text-red-600' : daysUntil <= 7 ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{submission.title}</p>
                          <p className="text-sm text-gray-600">
                            {submission.student?.user?.fullName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {daysUntil === 0 ? 'Due today' : daysUntil === 1 ? 'Due tomorrow' : `${daysUntil} days left`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {dashboardData.submissions.filter(s => new Date(s.deadline) > new Date()).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Students Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Student Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.students.slice(0, 6).map((student, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <ProfilePicture user={student.user} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{student.user?.fullName}</h4>
                      <p className="text-sm text-gray-600">{student.studentId}</p>
                    </div>
                  </div>
                  
                  {student.thesisTopic && (
                    <div className="mb-3">
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-700 line-clamp-2">{student.thesisTopic}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Joined {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                    {student.currentStage && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {student.currentStage}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;