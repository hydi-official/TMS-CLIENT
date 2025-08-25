import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, BarChart3, Bell, Award, Clock } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const quickStats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '6', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Upcoming Classes', value: '3', color: 'bg-green-500' },
    { icon: Award, label: 'Completed Assignments', value: '12', color: 'bg-purple-500' },
    { icon: BarChart3, label: 'Average Grade', value: 'B+', color: 'bg-orange-500' }
  ];

  const recentActivities = [
    { title: 'Math 101 - Assignment Due', time: 'Tomorrow', urgent: true },
    { title: 'Physics Lab - Quiz Available', time: '2 days', urgent: false },
    { title: 'English Essay - Feedback Received', time: '3 days ago', urgent: false },
    { title: 'Chemistry - New Material Posted', time: '1 week ago', urgent: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img 
                  src={logo} 
                  alt="Institution Logo" 
                  className="h-16 w-16 object-contain rounded-lg shadow-sm bg-white border border-gray-200 p-2"
                />
              </div>
              {/* Welcome Text */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.fullName || user?.firstName || 'Student'}! 🎓
                </h1>
                <p className="text-gray-600 mt-2">
                  Ready to continue your learning journey today?
                </p>
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
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activities
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.urgent && (
                      <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700">View Courses</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Schedule</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart3 className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Grades</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bell className="h-8 w-8 text-orange-500 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Notifications</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Announcements</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <p className="text-sm font-medium text-blue-800">System Maintenance</p>
                <p className="text-sm text-blue-700 mt-1">
                  The system will be under maintenance this Sunday from 2 AM to 4 AM.
                </p>
              </div>
              <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <p className="text-sm font-medium text-green-800">New Feature</p>
                <p className="text-sm text-green-700 mt-1">
                  Check out the new assignment submission portal in your courses section!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;