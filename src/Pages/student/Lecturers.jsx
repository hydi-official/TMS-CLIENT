import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  BookOpen, 
  Users, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Building,
  Calendar,
  UserCheck,
  Loader2
} from 'lucide-react';

const Lecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestingLecturerId, setRequestingLecturerId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const CARDS_PER_PAGE = 18;

  // Get base URL and token
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/users/lecturers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setLecturers(response.data);
    } catch (err) {
      console.error("Failed to fetch lecturers:", err);
      setError(err.response?.data?.message || "Failed to load lecturers");
    } finally {
      setLoading(false);
    }
  };

  const requestSupervisor = async (lecturerId) => {
    try {
      setRequestingLecturerId(lecturerId);
      setError("");

      const response = await axios.post(
        `${BASE_URL}/users/request-supervisor`,
        { lecturerId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data.message || "Supervisor request sent successfully!", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#7C3AED',
          color: 'white',
        },
      });
      
      // Refresh lecturers list to update current student counts
      await fetchLecturers();
      
    } catch (err) {
      console.error("Failed to request supervisor:", err);
      setError(err.response?.data?.message || "Failed to send supervisor request");
    } finally {
      setRequestingLecturerId(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(lecturers.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentLecturers = lecturers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <div className="text-lg text-gray-600">Loading lecturers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Toast Container */}
      <Toaster />
      
      <div className="w-full px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="w-10 h-10 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">Available Lecturers</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our experienced faculty members and request supervision for your academic journey.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Lecturers</p>
                  <p className="text-2xl font-bold text-gray-800">{lecturers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {lecturers.filter(l => l.isAcceptingStudents).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Page</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {currentPage} of {totalPages}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {lecturers.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No lecturers available</p>
              <p className="text-gray-500">Please check back later.</p>
            </div>
          ) : (
            <>
              {/* Lecturers Grid - 3 cards per row */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-8">
                {currentLecturers.map((lecturer) => (
                  <div key={lecturer._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6 border border-purple-50 w-full">
                    {/* Lecturer Avatar & Basic Info */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {lecturer.user.fullName}
                      </h3>
                      <p className="text-sm text-purple-600 font-medium">{lecturer.staffId}</p>
                    </div>

                    {/* Lecturer Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-3 text-purple-500" />
                        <span>{lecturer.department}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 break-words">
                        <Mail className="w-4 h-4 mr-3 text-purple-500 flex-shrink-0" />
                        <span className="truncate min-w-0">{lecturer.user.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-3 text-purple-500" />
                        <span>{lecturer.researchArea}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-3 text-purple-500" />
                        <span>Joined: {new Date(lecturer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Student Capacity */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <Users className="w-4 h-4 mr-2" />
                          Student Capacity
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {lecturer.currentStudents}/{lecturer.maxStudents}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(lecturer.currentStudents / lecturer.maxStudents) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Availability Status */}
                    <div className="mb-6 flex justify-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        lecturer.isAcceptingStudents 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {lecturer.isAcceptingStudents ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accepting Students
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Not Available
                          </>
                        )}
                      </span>
                    </div>

                    {/* Request Button */}
                    <button
                      onClick={() => requestSupervisor(lecturer._id)}
                      disabled={
                        !lecturer.isAcceptingStudents || 
                        lecturer.currentStudents >= lecturer.maxStudents ||
                        requestingLecturerId === lecturer._id
                      }
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm ${
                        !lecturer.isAcceptingStudents || lecturer.currentStudents >= lecturer.maxStudents
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : requestingLecturerId === lecturer._id
                          ? 'bg-purple-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {requestingLecturerId === lecturer._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Requesting...
                        </>
                      ) : !lecturer.isAcceptingStudents ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Not Available
                        </>
                      ) : lecturer.currentStudents >= lecturer.maxStudents ? (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Capacity Full
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Request Supervisor
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom Navigation */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-2 py-8 w-full overflow-x-auto">
                  <div className="flex items-center space-x-2 min-w-0">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors text-sm flex-shrink-0 ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Prev
                    </button>

                    <div className="flex space-x-1 overflow-x-auto">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;
                        
                        // Show first page, last page, current page, and pages around current
                        const showPage = 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        if (!showPage && page === currentPage - 2) {
                          return <span key={page} className="px-2 py-1 text-gray-400 text-sm">...</span>;
                        }
                        if (!showPage && page === currentPage + 2) {
                          return <span key={page} className="px-2 py-1 text-gray-400 text-sm">...</span>;
                        }
                        if (!showPage) return null;

                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-8 h-8 rounded-lg font-medium transition-colors text-sm flex-shrink-0 ${
                              isCurrentPage
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-purple-50 border border-purple-200'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors text-sm flex-shrink-0 ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lecturers;