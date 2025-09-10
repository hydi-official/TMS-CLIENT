import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, User, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const StudentAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://tms-backend-8gdz.onrender.com';
  
  // Get token from localStorage (same as Profile component)
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

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to view announcements');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/announcements`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
        setError(null);
      } else {
        setError('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Error loading announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if announcement is recent (within last 7 days)
  const isRecentAnnouncement = (dateString) => {
    const announcementDate = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.ceil((now - announcementDate) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  };

  // Get target audience badge color
  const getTargetAudienceBadge = (audience) => {
    switch(audience.toLowerCase()) {
      case 'all':
        return 'bg-blue-100 text-blue-800';
      case 'students':
        return 'bg-green-100 text-green-800';
      case 'staff':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Announcements</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnnouncements}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                <p className="text-gray-600">Stay updated with the latest news and updates</p>
              </div>
            </div>
            <button
              onClick={fetchAnnouncements}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Announcements Count */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  {announcements.length} {announcements.length === 1 ? 'announcement' : 'announcements'} available
                </span>
              </div>
              {announcements.some(ann => isRecentAnnouncement(ann.createdAt)) && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">New updates available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Announcements</h3>
            <p className="text-gray-500">There are no announcements to display at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl ${
                  isRecentAnnouncement(announcement.createdAt) ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                {/* Announcement Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{announcement.title}</h2>
                        {isRecentAnnouncement(announcement.createdAt) && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      
                      {/* Author and Date */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{announcement.author?.fullName || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(announcement.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Target Audience Badge */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTargetAudienceBadge(announcement.targetAudience)}`}>
                      {announcement.targetAudience}
                    </span>
                  </div>
                </div>

                {/* Announcement Message */}
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {announcement.message}
                  </p>
                </div>

                {/* Footer with additional info */}
                <div className="bg-gray-50 px-6 py-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>Status: 
                        <span className={`ml-1 font-medium ${announcement.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {announcement.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </span>
                      {announcement.expiresAt && (
                        <span>Expires: {formatDate(announcement.expiresAt)}</span>
                      )}
                    </div>
                    
                    {announcement.specificTargets && announcement.specificTargets.length > 0 && (
                      <span>Specific targets: {announcement.specificTargets.length}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncement;