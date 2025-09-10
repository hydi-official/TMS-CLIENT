import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Bell, 
  Award, 
  Clock, 
  FileText,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Camera,
  Edit,
  UserCheck
} from 'lucide-react';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    submissions: [],
    grades: [],
    notifications: [],
    announcements: []
  });
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarActivities, setCalendarActivities] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://tms-backend-8gdz.onrender.com';

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Check profile completeness
  const getProfileCompleteness = () => {
    const issues = [];
    
    if (!user?.profilePicture?.url) {
      issues.push({
        type: 'profile_picture',
        title: 'Add Profile Picture',
        message: 'Upload a profile picture to personalize your account',
        action: 'Update Profile Picture',
        icon: Camera,
        color: 'bg-blue-500'
      });
    }
    
    if (!profile?.thesisTitle) {
      issues.push({
        type: 'thesis_title',
        title: 'Set Thesis Title',
        message: 'Add your thesis title to complete your academic profile',
        action: 'Add Thesis Title',
        icon: Edit,
        color: 'bg-purple-500'
      });
    }
    
    return issues;
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Fetch data from all endpoints concurrently
      const [
        userResponse,
        submissionsResponse,
        gradesResponse,
        notificationsResponse,
        announcementsResponse
      ] = await Promise.allSettled([
        fetch(`${BASE_URL}/users/profile`, { headers }),
        fetch(`${BASE_URL}/submissions/my-submissions`, { headers }),
        fetch(`${BASE_URL}/submissions/my-grades`, { headers }),
        fetch(`${BASE_URL}/notifications`, { headers }),
        fetch(`${BASE_URL}/announcements`, { headers })
      ]);

      // Process user data
      if (userResponse.status === 'fulfilled' && userResponse.value.ok) {
        const userData = await userResponse.value.json();
        setUser(userData.user);
        setProfile(userData.profile); // Assuming profile data comes with user data
      }

      // Process submissions data
      let submissions = [];
      if (submissionsResponse.status === 'fulfilled' && submissionsResponse.value.ok) {
        const submissionData = await submissionsResponse.value.json();
        submissions = submissionData.submissions || [];
      }

      // Process grades data
      let grades = [];
      if (gradesResponse.status === 'fulfilled' && gradesResponse.value.ok) {
        const gradesData = await gradesResponse.value.json();
        grades = gradesData.grades || [];
      }

      // Process notifications data
      let notifications = [];
      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.ok) {
        const notificationData = await notificationsResponse.value.json();
        notifications = Array.isArray(notificationData) ? notificationData : [];
      }

      // Process announcements data
      let announcements = [];
      if (announcementsResponse.status === 'fulfilled' && announcementsResponse.value.ok) {
        const announcementData = await announcementsResponse.value.json();
        announcements = Array.isArray(announcementData) ? announcementData : [];
      }

      setDashboardData({
        submissions,
        grades,
        notifications,
        announcements
      });

      // Generate calendar activities from the data
      generateCalendarActivities(submissions, grades, announcements);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar activities from fetched data
  const generateCalendarActivities = (submissions, grades, announcements) => {
    const activities = [];

    // Add submission deadlines
    submissions.forEach(submission => {
      if (submission.deadline) {
        activities.push({
          id: `submission-${submission._id}`,
          title: `${submission.title} Due`,
          date: new Date(submission.deadline),
          type: 'deadline',
          status: submission.status,
          description: `${submission.stage} - ${submission.description}`,
          urgent: new Date(submission.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
        });
      }
    });

    // Add recent grade activities
    grades.forEach(grade => {
      if (grade.gradedAt) {
        activities.push({
          id: `grade-${grade._id}`,
          title: `${grade.title} Graded`,
          date: new Date(grade.gradedAt),
          type: 'grade',
          grade: grade.grade,
          description: `Grade: ${grade.grade}% - ${grade.status}`,
          urgent: false
        });
      }
    });

    // Add announcements
    announcements.forEach(announcement => {
      activities.push({
        id: `announcement-${announcement._id}`,
        title: announcement.title,
        date: new Date(announcement.createdAt),
        type: 'announcement',
        description: announcement.message.substring(0, 100) + '...',
        urgent: false
      });
    });

    // Sort activities by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    setCalendarActivities(activities);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getActivitiesForDate = (date) => {
    if (!date) return [];
    return calendarActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getActivityTypeIcon = (type) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-3 h-3" />;
      case 'grade':
        return <Award className="w-3 h-3" />;
      case 'announcement':
        return <Bell className="w-3 h-3" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  const getActivityTypeColor = (type, activity) => {
    switch (type) {
      case 'deadline':
        return activity.urgent ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
      case 'grade':
        return 'bg-green-100 text-green-800';
      case 'announcement':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats from real data
  const calculateStats = () => {
    const { submissions, grades, notifications } = dashboardData;
    
    return {
      enrolledCourses: new Set(submissions.map(s => s.stage)).size || 1,
      upcomingDeadlines: submissions.filter(s => 
        s.status === 'not-submitted' && 
        new Date(s.deadline) > new Date()
      ).length,
      completedAssignments: submissions.filter(s => 
        s.status === 'submitted' || s.status === 'accepted'
      ).length,
      averageGrade: grades.length > 0 
        ? Math.round(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length)
        : 0,
      unreadNotifications: notifications.filter(n => !n.isRead).length
    };
  };

  const stats = calculateStats();
  const profileIssues = getProfileCompleteness();

  const quickStats = [
    { 
      icon: BookOpen, 
      label: 'Active Stages', 
      value: stats.enrolledCourses.toString(), 
      color: 'bg-blue-500',
      trend: '+2 this semester'
    },
    { 
      icon: Clock, 
      label: 'Pending Submissions', 
      value: stats.upcomingDeadlines.toString(), 
      color: 'bg-orange-500',
      urgent: stats.upcomingDeadlines > 0
    },
    { 
      icon: Award, 
      label: 'Completed Work', 
      value: stats.completedAssignments.toString(), 
      color: 'bg-green-500',
      trend: `${stats.completedAssignments} submitted`
    },
    { 
      icon: BarChart3, 
      label: 'Average Grade', 
      value: stats.averageGrade > 0 ? `${stats.averageGrade}%` : 'N/A', 
      color: 'bg-purple-500',
      trend: stats.averageGrade >= 70 ? 'Good performance' : 'Needs improvement'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Completeness Alert */}
      {profileIssues.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Complete Your Profile
                </h3>
                <div className="space-y-2">
                  {profileIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between bg-yellow-100 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className={`${issue.color} p-1 rounded-full`}>
                          <issue.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">{issue.title}</p>
                          <p className="text-xs text-yellow-600">{issue.message}</p>
                        </div>
                      </div>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                        {issue.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supervisor Assignment Status */}
      {profile?.supervisor && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Supervisor Assigned
                </h3>
                <p className="text-sm text-green-600 mt-1">
                  You have been assigned to <strong>{profile.supervisor.user.fullName}</strong> in {profile.supervisor.department}
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {profile.supervisor.researchArea}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 bg-blue-500 rounded-lg shadow-sm border border-gray-200 p-2 flex items-center justify-center">
                  {user?.profilePicture?.url ? (
                    <img
                      src={user.profilePicture.url}
                      alt="Profile"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.fullName || 'Student'}!
                </h1>
                <p className="text-gray-600 mt-2">
                  Ready to continue your academic journey today?
                </p>
                {profile?.currentStage && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    Current Stage: {profile.currentStage.charAt(0).toUpperCase() + profile.currentStage.slice(1)}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                {stat.urgent && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                {stat.trend && (
                  <p className="text-xs text-gray-500">{stat.trend}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Academic Calendar
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium px-3">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const activities = day ? getActivitiesForDate(day) : [];
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-2 border rounded-lg ${
                        day 
                          ? `hover:bg-gray-50 cursor-pointer ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}` 
                          : 'border-transparent'
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {activities.slice(0, 2).map(activity => (
                              <div
                                key={activity.id}
                                className={`text-xs px-1 py-0.5 rounded flex items-center gap-1 ${getActivityTypeColor(activity.type, activity)}`}
                                title={activity.description}
                              >
                                {getActivityTypeIcon(activity.type)}
                                <span className="truncate">{activity.title.substring(0, 15)}...</span>
                              </div>
                            ))}
                            {activities.length > 2 && (
                              <div className="text-xs text-gray-500 px-1">
                                +{activities.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activities
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {calendarActivities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-1 rounded-full ${getActivityTypeColor(activity.type, activity)}`}>
                      {getActivityTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.date.toLocaleDateString()}
                      </p>
                    </div>
                    {activity.urgent && (
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
                {calendarActivities.length === 0 && (
                  <div className="text-center py-4">
                    <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Urgent Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Urgent Tasks</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.submissions
                  .filter(s => s.status === 'not-submitted' && new Date(s.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                  .slice(0, 5)
                  .map((submission) => {
                    const daysLeft = Math.ceil((new Date(submission.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={submission._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{submission.title}</p>
                          <p className="text-xs text-gray-500">{submission.stage}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          daysLeft <= 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days left`}
                        </span>
                      </div>
                    );
                  })}
                {dashboardData.submissions.filter(s => 
                  s.status === 'not-submitted' && 
                  new Date(s.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                ).length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No urgent tasks!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                {stats.unreadNotifications > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {stats.unreadNotifications} unread
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {dashboardData.notifications.slice(0, 5).map((notification) => (
                  <div key={notification._id} className={`p-3 rounded-lg ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
                {dashboardData.notifications.length === 0 && (
                  <div className="text-center py-4">
                    <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">View Submissions</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">Check Grades</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="h-8 w-8 text-purple-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">Notifications</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <User className="h-8 w-8 text-orange-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;