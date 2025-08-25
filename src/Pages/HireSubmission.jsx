import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion,AnimatePresence  } from 'framer-motion';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'react-toastify/dist/ReactToastify.css';
import useScrollToTop from "../utils/scrollToTop";

// Import images - replace with your actual images
import hero1 from '../assets/images/hero5.jpg';
import hero2 from '../assets/images/hero6.jpg';
import hero3 from '../assets/images/hero7.jpg';

// Reuse the color palette from the About page
const COLORS = {
  primary: '#00838F',    // Teal - Main brand color
  secondary: '#E67E22',  // Dull Orange - Accent/highlight color
  accent: '#D32F2F',     // Crimson - Call to action color
  dark: '#0F3057',       // Navy - Dark elements
  light: '#26A69A',      // Emerald - Light elements
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F5F7FA',
    200: '#E4E7EB',
    300: '#CBD2D9',
    600: '#616E7C',
    800: '#323F4B'
  }
};

// Hero slides data
const heroSlides = [
  { 
    image: hero1, 
    title: "Hire Submission", 
    subtitle: "Submit Employee Verification Requests" 
  },
  { 
    image: hero2, 
    title: "Fast & Reliable", 
    subtitle: "Get results within 48-72 hours" 
  },
  { 
    image: hero3, 
    title: "Secure & Confidential", 
    subtitle: "Your data is safe with us" 
  }
];

const HireSubmission = () => {
  useScrollToTop();

  const [activeSlide, setActiveSlide] = useState(0);
  const [employerDetails, setEmployerDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [employeeDetails, setEmployeeDetails] = useState([
    { name: '', email: '', phone: '' },
  ]);

  const handleEmployerChange = (e) => {
    const { name, value } = e.target;
    setEmployerDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEmployeeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEmployees = [...employeeDetails];
    updatedEmployees[index][name] = value;
    setEmployeeDetails(updatedEmployees);
  };

  const addEmployeeField = () => {
    setEmployeeDetails([...employeeDetails, { name: '', email: '', phone: '' }]);
  };

  const removeEmployeeField = (index) => {
    const updatedEmployees = [...employeeDetails];
    updatedEmployees.splice(index, 1);
    setEmployeeDetails(updatedEmployees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      employer: employerDetails,
      employees: employeeDetails,
      to_email: 'esseldacost00@gmail.com',  // Add your email here
    };
  
    try {
      await emailjs.send('service_c3zjgq7', 'template_tmsxw0b', formData, 'Y8uPpAz64MtqzpxV_');
      console.log('Email sent successfully');
      toast.success('Form submitted successfully!');
      setEmployerDetails({
        fullName: '',
        email: '',
        phone: '',
      });
      setEmployeeDetails([{ name: '', email: '', phone: '' }]);
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
    {/* Hero Section with Enhanced Animation */}
    <section className="relative w-full h-screen">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={1000}
        loop={true}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        className="absolute inset-0 w-full h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative">
              {/* Background Image */}
              <img 
                src={slide.image} 
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-8000"
                style={{ transitionDuration: '8000ms' }}
              />
              
              {/* Dark Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t" 
                style={{ 
                  background: `linear-gradient(to top, ${COLORS.dark} 0%, ${COLORS.dark}99 30%, ${COLORS.dark}40 100%)` 
                }}
              ></div>

              {/* Slide Content */}
              <AnimatePresence mode="wait">
                {activeSlide === index && (
                  <motion.div 
                    key={`slide-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                  >
                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                      {slide.title}
                    </h1>

                    <p 
                      className="text-lg md:text-2xl mt-4 max-w-3xl"
                      style={{ color: COLORS.gray[200] }}
                    >
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                      <Link 
                        to="/about" 
                        className="px-6 py-3 rounded-md font-semibold transform transition-all hover:scale-105 hover:shadow-lg"
                        style={{ 
                          backgroundColor: COLORS.secondary,
                          color: COLORS.dark
                        }}
                      >
                        Our Services
                      </Link>
                      <Link 
                        to="/how-it-works" 
                        className="px-6 py-3 rounded-md font-semibold transform transition-all hover:scale-105 hover:shadow-lg"
                        style={{ 
                          backgroundColor: COLORS.primary,
                          color: COLORS.white
                        }}
                      >
                        How It Works
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>

      {/* Hire Submission Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: COLORS.dark }}>
              Submit Employee Verification Requests
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employer Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>
                  Employer Details
                </h3>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1" style={{ color: COLORS.gray[800] }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={employerDetails.fullName}
                    onChange={handleEmployerChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: COLORS.gray[800] }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={employerDetails.email}
                    onChange={handleEmployerChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{ color: COLORS.gray[800] }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={employerDetails.phone}
                    onChange={handleEmployerChange}
                    required
                  />
                </div>
              </div>

              {/* Employee Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>
                  Employee Details
                </h3>
                {employeeDetails.map((employee, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div>
                      <label htmlFor={`employeeName-${index}`} className="block text-sm font-medium mb-1" style={{ color: COLORS.gray[800] }}>
                        Employee Name
                      </label>
                      <input
                        type="text"
                        id={`employeeName-${index}`}
                        name="name"
                        placeholder="Employee's full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={employee.name}
                        onChange={(e) => handleEmployeeChange(index, e)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`employeeEmail-${index}`} className="block text-sm font-medium mb-1" style={{ color: COLORS.gray[800] }}>
                        Employee Email
                      </label>
                      <input
                        type="email"
                        id={`employeeEmail-${index}`}
                        name="email"
                        placeholder="Employee's email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={employee.email}
                        onChange={(e) => handleEmployeeChange(index, e)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`employeePhone-${index}`} className="block text-sm font-medium mb-1" style={{ color: COLORS.gray[800] }}>
                        Employee Phone
                      </label>
                      <input
                        type="tel"
                        id={`employeePhone-${index}`}
                        name="phone"
                        placeholder="Employee's phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={employee.phone}
                        onChange={(e) => handleEmployeeChange(index, e)}
                        required
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeEmployeeField(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Employee
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEmployeeField}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Another Employee
                </button>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-900 text-white rounded-md font-semibold hover:bg-[#5D5B87] transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HireSubmission;