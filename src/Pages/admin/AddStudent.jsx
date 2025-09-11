import React, { useState } from 'react';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    pin: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    department: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const departments = [
    'Computer Science',
    'Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Business Administration',
    'Psychology',
    'English Literature',
    'History'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      const raw = JSON.stringify({
        studentId: formData.studentId,
        pin: formData.pin,
        email: formData.email,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        department: formData.department
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch("https://tms-backend-8gdz.onrender.com/api/auth/student/signup", requestOptions);
      const result = await response.text();
      
      if (response.ok) {
        showToast('Student added successfully!', 'success');
        setFormData({
          studentId: '',
          pin: '',
          email: '',
          fullName: '',
          dateOfBirth: '',
          department: ''
        });
      } else {
        showToast('Failed to add student. Please try again.', 'error');
      }
      
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full sm:w-auto p-4 rounded-xl shadow-2xl transition-all duration-500 ease-out ${
          toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${
          toast.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        }`}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              <span className="text-lg font-bold">
                {toast.type === 'success' ? '✓' : '✗'}
              </span>
            </div>
            <span className="font-semibold text-sm sm:text-base">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="text-center mb-8 lg:hidden">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Student Registration
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Join our academic community and begin your journey
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          
          {/* Left Side - Illustration & Info */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
            {/* Desktop Header */}
            <div className="hidden lg:block text-left">
              <h1 className="text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Student Registration
              </h1>
              <p className="text-lg xl:text-xl text-gray-600 leading-relaxed">
               Add a student to join our academic community and begin your educational journey with us.
              </p>
            </div>

            {/* Animated Registration Scene */}
            <div className="w-full">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg">
                <div className="w-full aspect-video bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl lg:rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 to-purple-300/30"></div>
                  
                  {/* Floating Elements - Smaller on mobile */}
                  <div className="absolute top-4 left-4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
                  <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-pink-400 rounded-full animate-pulse opacity-70"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-green-400 rounded-full animate-bounce opacity-75" style={{animationDelay: '300ms'}}></div>
                  
                  {/* Central Icon */}
                  <div className="z-10 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto animate-pulse">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Registration Portal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Quick Process</h3>
                <p className="text-xs sm:text-sm text-gray-600">Fast and secure registration</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Academic Excellence</h3>
                <p className="text-xs sm:text-sm text-gray-600">Join top-tier education</p>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="order-1 lg:order-2 w-full">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 max-w-lg lg:max-w-none mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create Student Account</h2>
                <p className="text-sm sm:text-base text-gray-600">Fill in student details to get started</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Row 1: Student ID and PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                      placeholder="Enter student ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      PIN
                    </label>
                    <input
                      type="password"
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                      placeholder="Enter PIN"
                    />
                  </div>
                </div>

                {/* Row 2: Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Row 3: Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Row 4: Date of Birth and Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-98 shadow-lg hover:shadow-xl'
                  } text-white`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="text-sm sm:text-base">Processing Registration...</span>
                    </div>
                  ) : (
                    'Register Student'
                  )}
                </button>

              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;