import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion, useInView, useAnimation ,AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
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

// Reuse the AnimatedSection component
const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Hero slides data
const heroSlides = [
  { 
    image: hero1, 
    title: "How It Works", 
    subtitle: "Streamlined Processes for Employers and Workers" 
  },
  { 
    image: hero2, 
    title: "For Employers", 
    subtitle: "Make Informed Hiring Decisions with VeriHire" 
  },
  { 
    image: hero3, 
    title: "For Workers", 
    subtitle: "Get Verified and Matched to Top Employers" 
  }
];

// Pricing plans data
const pricingPlans = {
  payPerCheck: [
    {
      title: "Basic Background Check",
      price: "GHS 50",
      description: "Per candidate",
      features: ["Essential verification", "48-72 hour turnaround", "Online report access"]
    },
    {
      title: "Full Employment History",
      price: "GHS 150",
      description: "Per candidate",
      features: ["Complete work history", "Reference verification", "Detailed report"]
    },
    {
      title: "Criminal Record Check",
      price: "GHS 200",
      description: "Per candidate",
      features: ["Legal background verification", "National database search", "Official documentation"]
    }
  ],
  subscription: [
    {
      title: "Small Business Plan",
      price: "GHS 500",
      description: "Per month",
      features: ["Up to 10 background checks", "Dashboard access", "Email support"]
    },
    {
      title: "Corporate Plan",
      price: "GHS 2000",
      description: "Per month",
      features: ["Up to 50 background checks", "Priority processing", "Dedicated account manager"]
    },
    {
      title: "Enterprise Plan",
      price: "Custom",
      description: "Contact for pricing",
      features: ["High-volume checks", "API integration", "Custom reporting"]
    }
  ]
};

const HowItWorks = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  useScrollToTop();

  const [activePricingTab, setActivePricingTab] = useState('payPerCheck');

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

      {/* For Employers Section */}
      <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.white }}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 relative inline-block" style={{ color: COLORS.dark }}>
              <span className="inline-block pb-2 border-b-4" style={{ borderColor: COLORS.secondary }}>
                For Employers
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: COLORS.gray[600] }}>
              Streamlined steps to verify candidates and make informed hiring decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>1</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>Submit a Request</h3>
              <p style={{ color: COLORS.gray[600] }}>Provide candidate details via our platform.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>2</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>Verification Process</h3>
              <p style={{ color: COLORS.gray[600] }}>We contact past employers and validate credentials.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>3</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>Receive a Report</h3>
              <p style={{ color: COLORS.gray[600] }}>Get a full breakdown of the worker's history.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>4</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>Make a Decision</h3>
              <p style={{ color: COLORS.gray[600] }}>Use verified information to hire confidently.</p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* For Workers Section */}
      <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.gray[100] }}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 relative inline-block" style={{ color: COLORS.dark }}>
              <span className="inline-block pb-2 border-b-4" style={{ borderColor: COLORS.secondary }}>
                For Workers
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: COLORS.gray[600] }}>
              Steps to get verified and matched with top employers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>1</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>Register</h3>
              <p style={{ color: COLORS.gray[600] }}>Upload your CV and employment history.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>2</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>Get Verified</h3>
              <p style={{ color: COLORS.gray[600] }}>We validate your background and references.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>3</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>Get Matched</h3>
              <p style={{ color: COLORS.gray[600] }}>Verified workers gain priority placement.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>4</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>Get Hired</h3>
              <p style={{ color: COLORS.gray[600] }}>Attend orientation and start your new job.</p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

   
      {/* Call to Action Section */}
      <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.primary }}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.gray[800] }}>
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8" style={{ color: COLORS.gray[700] }}>
              Join VeriHire today and experience seamless hiring and verification.
            </p>
            <Link 
              to="/contact" 
              className="inline-block px-8 py-3 rounded-md font-semibold transform transition-all hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: COLORS.secondary,
                color: COLORS.dark
              }}
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default HowItWorks;