import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion,AnimatePresence  } from 'framer-motion';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
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
import contactformimage from '../assets/images/contactformimage.png';

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
    title: "Contact Us", 
    subtitle: "Reach Out to the Hire Verify Group" 
  },
  { 
    image: hero2, 
    title: "Get in Touch", 
    subtitle: "We're Here to Help You" 
  },
  { 
    image: hero3, 
    title: "Let's Connect", 
    subtitle: "Your Success is Our Priority" 
  }
];

const Contact = () => {
  const [activeSlide, setActiveSlide] = useState(0);
    useScrollToTop();

  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const whatsappUrl = 'https://wa.me/+233257211371?text=Hello, I need assistance with your service!';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send('service_c3zjgq7', 'template_tmsxw0b', formData, 'Y8uPpAz64MtqzpxV_');
      console.log('Email sent successfully');
      toast.success('Form submitted successfully!');
      setFormData({
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Error submitting form. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* Left side - Form */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: COLORS.dark }}>
                CONTACT FORM
              </h2>
              <p className="text-lg mb-6" style={{ color: COLORS.gray[600] }}>
                Reach out to us via the form below, and our team will get back to you as soon as possible.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="* Email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="subject"
                    placeholder="* Subject" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <textarea 
                    name="message"
                    placeholder="* Message" 
                    rows="6" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-center">
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-indigo-900 text-white rounded-md font-semibold hover:bg-[#5D5B87] transition-all"
                  >
                    SUBMIT
                  </button>
                </div>
              </form>

              {/* WhatsApp Button */}
              <div className="text-center mt-8">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition flex items-center justify-center space-x-3"
                >
                  <FaWhatsapp size={20} />
                  <span>Chat with Us on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right side - Map */}
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.4004904045087!2d-0.01034472635575138!3d5.655066432648333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf80af963b1c9b%3A0x8d7570adc0146c94!2sBarcadis%20Night%20Club!5e0!3m2!1sen!2sgh!4v1735356623139!5m2!1sen!2sgh"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 px-4" style={{ backgroundColor: COLORS.gray[100] }}>
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl font-semibold mb-8"
            style={{ color: COLORS.dark }}
          >
            You can also reach out to us on social media via the following platforms:
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center space-x-6"
          >
            <a href="#" className="p-4 bg-white rounded-full hover:bg-gray-200 transition-all">
              <FaFacebook size={24} style={{ color: COLORS.primary }} />
            </a>
            <a href="#" className="p-4 bg-white rounded-full hover:bg-gray-200 transition-all">
              <FaTwitter size={24} style={{ color: COLORS.primary }} />
            </a>
            <a href="#" className="p-4 bg-white rounded-full hover:bg-gray-200 transition-all">
              <FaLinkedin size={24} style={{ color: COLORS.primary }} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;