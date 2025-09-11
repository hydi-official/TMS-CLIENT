import React, { useState } from 'react';

const AddLecturer = () => {
  const [formData, setFormData] = useState({
    staffId: '',
    pin: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    department: '',
    researchArea: ''
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

  const researchAreas = [
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Software Engineering',
    'Cybersecurity',
    'Web Development',
    'Mobile Development',
    'Database Systems',
    'Computer Networks',
    'Human-Computer Interaction',
    'Computer Graphics',
    'Algorithms and Data Structures',
    'Operating Systems',
    'Distributed Systems',
    'Quantum Computing'
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
        staffId: formData.staffId,
        pin: formData.pin,
        email: formData.email,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        department: formData.department,
        researchArea: formData.researchArea
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch("https://tms-backend-8gdz.onrender.com/api/auth/lecturer/signup", requestOptions);
      const result = await response.text();
      
      if (response.ok) {
        showToast('Lecturer added successfully!', 'success');
        setFormData({
          staffId: '',
          pin: '',
          email: '',
          fullName: '',
          dateOfBirth: '',
          department: '',
          researchArea: ''
        });
      } else {
        showToast('Failed to add lecturer. Please try again.', 'error');
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
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
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            Lecturer Registration
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Add new faculty members to our academic team
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          
          {/* Left Side - Illustration & Info */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
            {/* Desktop Header */}
            <div className="hidden lg:block text-left">
              <h1 className="text-4xl xl:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                Lecturer Registration
              </h1>
              <p className="text-lg xl:text-xl text-gray-600 leading-relaxed">
                Add new faculty members to strengthen our academic excellence.
              </p>
            </div>

            {/* Animated Registration Scene */}
            <div className="w-full">
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg">
                <div className="w-full aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 rounded-xl lg:rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/30 to-teal-300/30"></div>
                  
                  {/* Floating Elements - Academic themed */}
                  <div className="absolute top-4 left-4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
                  <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-orange-400 rounded-full animate-pulse opacity-70"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-400 rounded-full animate-bounce opacity-75" style={{animationDelay: '300ms'}}></div>
                  
                  {/* Central Icon - Academic cap */}
                  <div className="z-10 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto animate-pulse">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Faculty Portal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Verified Faculty</h3>
                <p className="text-xs sm:text-sm text-gray-600">Qualified academic staff</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Research Excellence</h3>
                <p className="text-xs sm:text-sm text-gray-600">Specialized research areas</p>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="order-1 lg:order-2 w-full">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 max-w-lg lg:max-w-none mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Add Lecturer</h2>
                <p className="text-sm sm:text-base text-gray-600">Fill in lecturer details to create account</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Row 1: Staff ID and PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Staff ID
                    </label>
                    <input
                      type="text"
                      name="staffId"
                      value={formData.staffId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                      placeholder="Enter staff ID"
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
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
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
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                    placeholder="Enter full name (e.g., Dr. John Smith)"
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
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
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
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
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
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
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

                {/* Row 5: Research Area */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Research Area
                  </label>
                  <select
                    name="researchArea"
                    value={formData.researchArea}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                  >
                    <option value="">Select research area</option>
                    {researchAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 shadow-lg hover:shadow-xl'
                  } text-white`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="text-sm sm:text-base">Adding Lecturer...</span>
                    </div>
                  ) : (
                    'Add Lecturer'
                  )}
                </button>

                {/* Footer Text */}
                <div className="text-center pt-2 sm:pt-4">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Lecturer account will be created with the provided credentials
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLecturer;