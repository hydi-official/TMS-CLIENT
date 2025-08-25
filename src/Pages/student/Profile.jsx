import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Calendar, GraduationCap, BookOpen, Lock, Save, Edit3, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    thesisTopic: ''
  });

  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';
  
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
  const ProfilePicture = ({ src, name, size = 'w-32 h-32', textSize = 'text-2xl' }) => {
    const initials = getUserInitials(name);
    const bgColor = getInitialsColor(name);
    
    if (src) {
      return (
        <img
          src={src}
          alt="Profile"
          className={`${size} rounded-full border-4 border-white object-cover bg-gray-200`}
        />
      );
    }
    
    return (
      <div className={`${size} rounded-full border-4 border-white ${bgColor} flex items-center justify-center`}>
        <span className={`${textSize} font-semibold text-white`}>
          {initials}
        </span>
      </div>
    );
  };

  // Fetch user profile data
  const fetchProfileData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Please login to access your profile');
        return;
      }

      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setProfileData(data.profile);
        setFormData({
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          thesisTopic: data.profile?.thesisTopic || ''
        });
      } else {
        toast.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle profile picture selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update profile information
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('thesisTopic', formData.thesisTopic);
      
      // Add profile picture if selected
      if (profilePictureFile) {
        formDataToSend.append('profilePicture', profilePictureFile);
      }

      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Profile updated successfully!');
        setUserData(data.user);
        if (data.profile) {
          setProfileData(data.profile);
        }
        setEditMode(false);
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Change PIN
  const handleChangePin = async (e) => {
    e.preventDefault();
    
    if (pinData.newPin !== pinData.confirmPin) {
      toast.error('New PIN and confirmation do not match');
      return;
    }

    if (pinData.newPin.length < 6) {
      toast.error('PIN must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/change-pin`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPin: pinData.currentPin,
          newPin: pinData.newPin
        })
      });

      if (response.ok) {
        toast.success('PIN changed successfully!');
        setPinData({ currentPin: '', newPin: '', confirmPin: '' });
        setShowPinChange(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to change PIN');
      }
    } catch (error) {
      console.error('Error changing PIN:', error);
      toast.error('Error changing PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePinInputChange = (e) => {
    const { name, value } = e.target;
    setPinData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          
          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-8">
              <div className="relative">
                <ProfilePicture
                  src={profilePicturePreview || userData?.profilePicture?.url}
                  name={userData?.fullName}
                />
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Profile Info Header */}
            <div className="pt-20 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{userData?.fullName}</h1>
                <p className="text-gray-600 capitalize">{userData?.role}</p>
                <p className="text-gray-500">{userData?.department}</p>
              </div>
              
              <div className="flex gap-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setProfilePictureFile(null);
                      setProfilePicturePreview(null);
                      setFormData({
                        fullName: userData?.fullName || '',
                        email: userData?.email || '',
                        thesisTopic: profileData?.thesisTopic || ''
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
                
                <button
                  onClick={() => setShowPinChange(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Change PIN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h2>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thesis Topic
                  </label>
                  <textarea
                    name="thesisTopic"
                    value={formData.thesisTopic}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your thesis topic..."
                  />
                </div>

                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{formatDate(userData?.dateOfBirth)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium">{userData?.userId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Thesis Topic</p>
                    <p className="font-medium">{profileData?.thesisTopic || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Academic Progress */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Academic Progress</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Current Stage</p>
                <p className="font-medium capitalize">{profileData?.currentStage || 'Not started'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileData?.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{profileData?.progress || 0}%</span>
                </div>
              </div>

              {profileData?.supervisor && (
                <div>
                  <p className="text-sm text-gray-500">Supervisor</p>
                  <p className="font-medium">{profileData.supervisor.user?.fullName}</p>
                  <p className="font-medium">Staff ID: {profileData.supervisor.staffId}</p>
                  <p className="text-sm text-gray-600">Research Area: {profileData.supervisor.researchArea}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{formatDate(userData?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PIN Change Modal */}
        {showPinChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Change PIN</h3>
                <button
                  onClick={() => setShowPinChange(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current PIN
                  </label>
                  <input
                    type="password"
                    name="currentPin"
                    value={pinData.currentPin}
                    onChange={handlePinInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New PIN
                  </label>
                  <input
                    type="password"
                    name="newPin"
                    value={pinData.newPin}
                    onChange={handlePinInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    name="confirmPin"
                    value={pinData.confirmPin}
                    onChange={handlePinInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength="6"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPinChange(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePin}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Changing...' : 'Change PIN'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;