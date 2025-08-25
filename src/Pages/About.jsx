import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion, useInView, useAnimation,AnimatePresence  } from 'framer-motion';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import useScrollToTop from "../utils/scrollToTop";

// Import images - you'll need to replace these with your actual VeriHire images
import hero1 from '../assets/images/hero5.jpg';
import hero2 from '../assets/images/hero6.jpg';
import hero3 from '../assets/images/hero7.jpg';
import avatar from '../assets/images/edi.jpg';
import ceoImage from '../assets/images/edi.jpg'; // Using placeholder, replace with actual CEO image

// Color palette constants - Teal, Dull Orange, Crimson, Navy, Emerald theme
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

// Animated Section component for fade-in animations
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

// Counter component for the stats with improved animation
const Counter = ({ endValue, textColor = COLORS.gray[800] }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.5 });
  
  useEffect(() => {
    if (!inView) return;
    
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const steps = Math.ceil(duration / interval);
    const increment = endValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [endValue, inView]);

  return <h3 ref={ref} className="text-xl md:text-2xl font-bold" style={{ color: textColor }}>+{count}</h3>;
};

// Team Member Card Component
const TeamMemberCard = ({ name, position, image, description }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-lg overflow-hidden shadow-lg"
    >
      <div className="h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1" style={{ color: COLORS.dark }}>{name}</h3>
        <p className="text-sm mb-4" style={{ color: COLORS.secondary }}>{position}</p>
        <p className="text-base" style={{ color: COLORS.gray[600] }}>{description}</p>
        <div className="mt-4 flex space-x-3">
          <a href="#" className="text-lg hover:text-primary" style={{ color: COLORS.primary }}>
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" className="text-lg hover:text-primary" style={{ color: COLORS.primary }}>
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-lg hover:text-primary" style={{ color: COLORS.primary }}>
            <i className="far fa-envelope"></i>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// Value Card Component
const ValueCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>{icon}</div>
      <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>{title}</h3>
      <p style={{ color: COLORS.gray[600] }}>{description}</p>
    </motion.div>
  );
};

// Milestone component
const Milestone = ({ year, title, description }) => {
  return (
    <div className="relative flex items-start ml-6 mb-8">
      <div 
        className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full border-4"
        style={{ borderColor: COLORS.secondary, backgroundColor: COLORS.white }}
      ></div>
      <div className="border-l-4 pl-6 pb-2" style={{ borderColor: COLORS.light }}>
        <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold rounded-md" style={{ backgroundColor: COLORS.secondary, color: COLORS.white }}>
          {year}
        </span>
        <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.dark }}>{title}</h3>
        <p style={{ color: COLORS.gray[600] }}>{description}</p>
      </div>
    </div>
  );
};

const heroSlides = [
  { 
    image: hero1, 
    title: "About VeriHire Ghana", 
    subtitle: "Building Trust in Ghana's Workforce" 
  },
  { 
    image: hero2, 
    title: "Our Commitment to Excellence", 
    subtitle: "Providing Transparent & Reliable Verification Services" 
  },
  { 
    image: hero3, 
    title: "Meet Our Team", 
    subtitle: "Dedicated Professionals Setting Industry Standards" 
  }
];

// Team member data
const teamData = [
  {
    name: "Kwame Owusu",
    position: "CEO & Founder",
    image: avatar,
    description: "With over 15 years in HR and recruitment, Kwame founded VeriHire to solve Ghana's employment verification challenges."
  },
  {
    name: "Abena Mensah",
    position: "Operations Director",
    image: avatar,
    description: "Abena oversees all verification processes, ensuring accuracy and timeliness for every client request."
  },
  {
    name: "Emmanuel Adjei",
    position: "Head of Technology",
    image: avatar,
    description: "Emmanuel designed VeriHire's secure verification platform and database management systems."
  },
  {
    name: "Fatima Ibrahim",
    position: "Client Relations Manager",
    image: avatar,
    description: "Fatima ensures our clients receive exceptional service and customized solutions for their industry needs."
  },
  {
    name: "Essel Eghan ",
    position: "Customer Relations Manager",
    image: avatar,
    description: "Essel ensures our clients receive exceptional service and customized solutions for their industry needs."
  }
];

// Company values data
const valuesData = [
  {
    icon: "⚖️",
    title: "Integrity",
    description: "We uphold the highest standards of honesty and ethical conduct in all our verification processes."
  },
  {
    icon: "🔍",
    title: "Accuracy",
    description: "Our multi-step verification process ensures precise and reliable information for every client."
  },
  {
    icon: "🛡️",
    title: "Confidentiality",
    description: "We handle all sensitive information with strict privacy standards and secure data protocols."
  },
  {
    icon: "⏱️",
    title: "Efficiency",
    description: "Our streamlined processes deliver quick results without compromising on quality or thoroughness."
  }
];

// Company milestones data
const milestonesData = [
  {
    year: "2018",
    title: "VeriHire Ghana Founded",
    description: "Established to address the growing need for reliable employment verification in Ghana's professional sector."
  },
  {
    year: "2019",
    title: "First 100 Corporate Clients",
    description: "Reached our milestone of serving 100 businesses across hospitality, security, and healthcare industries."
  },
  {
    year: "2020",
    title: "Digital Platform Launch",
    description: "Introduced our proprietary verification database and employer portal for streamlined access to reports."
  },
  {
    year: "2022",
    title: "Worker Training Program",
    description: "Expanded services to include professional workplace training and orientation for verified job seekers."
  },
  {
    year: "2023",
    title: "Industry Recognition",
    description: "Named 'Most Innovative HR Solution' at the Ghana Business Excellence Awards."
  }
];

const About = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  useScrollToTop();

  return (
    <div className="relative w-full overflow-hidden">
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

      {/* Who We Are Section */}
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
                Who We Are
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: COLORS.gray[600] }}>
              VeriHire Ghana is a background verification and a professional recruitment service designed to help businesses make informed hiring decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src={hero2} 
                alt="VeriHire Team" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.primary }}>
                Ghana's Premier Verification Service
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-lg" style={{ color: COLORS.secondary }}>•</div>
                  <p style={{ color: COLORS.gray[600] }}>
                    <span className="font-semibold" style={{ color: COLORS.dark }}>Detailed Background Checks</span> on job seekers to verify their credentials and work history.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-lg" style={{ color: COLORS.secondary }}>•</div>
                  <p style={{ color: COLORS.gray[600] }}>
                    <span className="font-semibold" style={{ color: COLORS.dark }}>Verified Database</span> of workers with authenticated employment records.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-lg" style={{ color: COLORS.secondary }}>•</div>
                  <p style={{ color: COLORS.gray[600] }}>
                    <span className="font-semibold" style={{ color: COLORS.dark }}>Reference Checks</span> and misconduct reports for hiring companies.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-lg" style={{ color: COLORS.secondary }}>•</div>
                  <p style={{ color: COLORS.gray[600] }}>
                    <span className="font-semibold" style={{ color: COLORS.dark }}>Professional Training</span> and orientation for workers to meet workplace standards.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link 
                  to="/about" 
                  className="inline-block px-6 py-3 rounded-md font-semibold transition-all hover:shadow-lg"
                  style={{ 
                    backgroundColor: COLORS.primary,
                    color: COLORS.white
                  }}
                >
                  Explore Our Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Message from CEO Section */}
      <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.gray[100] }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-1/3 bg-cover"
                style={{ backgroundColor: COLORS.dark }}
              >
                <div className="h-full flex flex-col justify-center items-center p-8 text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 mb-4" style={{ borderColor: COLORS.secondary }}>
                    <img src={ceoImage} alt="CEO" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: COLORS.white }}>Kwame Owusu</h3>
                  <p className="text-sm" style={{ color: COLORS.gray[300] }}>Founder & CEO</p>
                  <div className="mt-4 flex space-x-3">
                    <a href="#" className="text-lg" style={{ color: COLORS.secondary }}>
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="text-lg" style={{ color: COLORS.secondary }}>
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full md:w-2/3 p-8"
              >
                <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.dark }}>
                  Message from Our CEO
                </h2>
                <div className="text-4xl mb-4" style={{ color: COLORS.secondary }}>"</div>
                <p className="mb-4 italic" style={{ color: COLORS.gray[600] }}>
                  Welcome to VeriHire Ghana. My journey in establishing this company began with a simple observation: Ghana's growing economy needed a more reliable system for employment verification and workforce development.
                </p>
                <p className="mb-4" style={{ color: COLORS.gray[600] }}>
                  Having worked in HR for over a decade, I witnessed firsthand the challenges companies face in verifying candidate credentials and work histories. These challenges often led to poor hiring decisions, workplace misconduct, and unnecessary turnover.
                </p>
                <p className="mb-4" style={{ color: COLORS.gray[600] }}>
                  At VeriHire, we're building Ghana's most trusted verification platform to solve these problems. Our mission goes beyond simple background checks—we're creating a transparent ecosystem where employers can make confident hiring decisions and workers can showcase their verified credentials.
                </p>
                <p style={{ color: COLORS.gray[600] }}>
                  I invite you to join us in building a more trustworthy workforce for Ghana's future.
                </p>
               
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Our Vision & Mission Section */}
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
                Our Vision & Mission
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br rounded-lg p-6 shadow-lg"
              style={{ 
                background: `linear-gradient(to bottom right, ${COLORS.dark}, ${COLORS.primary})` 
              }}
            >
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold" style={{ color: COLORS.white }}>Our Vision</h3>
              </div>
              <p className="text-lg" style={{ color: COLORS.gray[200] }}>
                To be Ghana's most trusted workforce verification and recruitment platform, ensuring transparency and reliability in hiring.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-gray-100 rounded-lg p-6 shadow-lg"
              style={{ 
                background: "bg-gray-100"
              }}
            >
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold" style={{ color: COLORS.dark }}>Our Mission</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="mr-2 text-lg" style={{ color: COLORS.dark }}>✔</span>
                  <p style={{ color: COLORS.dark }}>Provide authentic employment verification services.</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg" style={{ color: COLORS.dark }}>✔</span>
                  <p style={{ color: COLORS.dark }}>Create a secure and transparent job-seeking environment.</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg" style={{ color: COLORS.dark }}>✔</span>
                  <p style={{ color: COLORS.dark }}>Help businesses minimize hiring risks and fraudulent employment.</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg" style={{ color: COLORS.dark }}>✔</span>
                  <p style={{ color: COLORS.dark }}>Equip workers with ethical workplace conduct training.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Our Values Section */}
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
                Our Core Values
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: COLORS.gray[600] }}>
              The principles that guide our work and relationships with clients, workers, and partners.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuesData.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ValueCard 
                  icon={value.icon} 
                  title={value.title} 
                  description={value.description} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Our Team Section */}
     {/* Our Team Section with Slider */}
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
                Meet Our Team
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: COLORS.gray[600] }}>
              The dedicated professionals working to build Ghana's most trusted verification service.
            </p>
          </motion.div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{ nextEl: '.team-slider-next', prevEl: '.team-slider-prev' }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="team-slider"
          >
            {teamData.map((member, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <TeamMemberCard 
                    name={member.name} 
                    position={member.position} 
                    image={member.image} 
                    description={member.description} 
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </AnimatedSection>

      {/* Our Journey Section */}
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
                Our Journey
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: COLORS.gray[600] }}>
              Key milestones in our mission to transform workforce verification in Ghana.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto mt-16 relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-6 w-0.5" style={{ backgroundColor: COLORS.gray[300] }}></div>
            
            {/* Milestones */}
            {milestonesData.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Milestone 
                  year={milestone.year} 
                  title={milestone.title} 
                  description={milestone.description} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

            {/* Stats Section */}
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
                By The Numbers
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: COLORS.gray[600] }}>
              Our impact in numbers - the results of our commitment to excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Counter endValue={500} textColor={COLORS.primary} />
              <p className="text-lg" style={{ color: COLORS.gray[600] }}>Corporate Clients</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <Counter endValue={10000} textColor={COLORS.secondary} />
              <p className="text-lg" style={{ color: COLORS.gray[600] }}>Verified Workers</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Counter endValue={95} textColor={COLORS.accent} />
              <p className="text-lg" style={{ color: COLORS.gray[600] }}>Accuracy Rate</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <Counter endValue={24} textColor={COLORS.dark} />
              <p className="text-lg" style={{ color: COLORS.gray[600] }}>Hours Average Turnaround</p>
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
            <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.gray[900] }}>
              Ready to Build a Trustworthy Workforce?
            </h2>
            <p className="text-lg mb-8" style={{ color: COLORS.gray[800] }}>
              Join hundreds of businesses who trust VeriHire for their hiring needs.
            </p>
            <Link 
              to="/contact" 
              className="inline-block px-8 py-3 rounded-md font-semibold transform transition-all hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: COLORS.secondary,
                color: COLORS.dark
              }}
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default About;