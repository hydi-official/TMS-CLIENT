import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, User, FileText, Clock, X, AlertCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const BASE_URL = 'https://tms-backend-8gdz.onrender.com';

  // Get token from localStorage (same as profile component)
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

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('Please login to access notifications');
        return;
      }

      const response = await fetch(`${BASE_URL}/notifications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data || []);
      } else {
        console.error('Failed to fetch notifications');
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark single notification as read
  const markAsRead = async (notificationId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification._id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        console.log('Notification marked as read');
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        console.log('All notifications marked as read');
      } else {
        console.error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete single notification
  const deleteNotification = async (notificationId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notification => notification._id !== notificationId)
        );
        console.log('Notification deleted');
      } else {
        console.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/notifications/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setNotifications([]);
        setShowConfirmDialog(false);
        console.log('All notifications deleted');
      } else {
        console.error('Failed to delete all notifications');
      }
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle notification selection
  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Select all notifications
  const selectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n._id));
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'submission':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={selectAll}
                    className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {selectedNotifications.length === notifications.length ? 'Deselect All' : 'Select All'}
                  </button>
                  
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark All Read
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={() => toggleNotificationSelection(notification._id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    {/* Notification Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`text-lg font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {formatDate(notification.createdAt)}
                            {!notification.isRead && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium ml-2">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              disabled={actionLoading}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            disabled={actionLoading}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        {notifications.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold">Delete All Notifications</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete all notifications? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAllNotifications}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Deleting...' : 'Delete All'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;