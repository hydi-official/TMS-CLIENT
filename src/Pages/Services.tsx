import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import useScrollToTop from "../utils/scrollToTop";

// Import images - you'll need to replace these with your actual service images
import hero1 from '../assets/images/hero5.jpg';
import hero2 from '../assets/images/hero6.jpg';
import hero3 from '../assets/images/hero7.jpg';

// Same color palette from Home page
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

// Re-use the AnimatedSection component from Home page
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

// Hero slides data for services page
const serviceHeroSlides = [
  { 
    image: hero1, 
    title: "Comprehensive Verification Services", 
    subtitle: "Making Informed Hiring Decisions in Ghana" 
  },
  { 
    image: hero2, 
    title: "Professional Recruitment Solutions", 
    subtitle: "Connecting Verified Workers with Quality Employers" 
  },
  { 
    image: hero3, 
    title: "Worker Training & Orientation", 
    subtitle: "Preparing Candidates for Professional Success" 
  }
];

// Background check services data
const backgroundCheckServices = [
  {
    title: "Employment Verification",
    description: "Confirm work history, job positions, and tenure of potential employees.",
    icon: "💼"
  },
  {
    title: "Criminal Record Checks",
    description: "Ensure candidates have a clean legal history for sensitive positions.",
    icon: "🔎"
  },
  {
    title: "Reference & Conduct Checks",
    description: "Gather feedback from previous employers about candidate performance.",
    icon: "📋"
  },
  {
    title: "Educational Verification",
    description: "Confirm degrees, certificates, and qualifications from educational institutions.",
    icon: "🎓"
  },
  {
    title: "Credit & Financial Background",
    description: "Ensure financial stability for roles with fiscal responsibility.",
    icon: "💳"
  }
];

// Recruitment services data
const recruitmentServices = [
  {
    title: "Permanent & Contract Staffing",
    description: "Find the right employees for long-term or project-based roles.",
    icon: "👥"
  },
  {
    title: "Skilled Worker Matching",
    description: "Place skilled professionals in specialized positions across industries.",
    icon: "🔧"
  },
  {
    title: "Unskilled Worker Placement",
    description: "Connect reliable, verified workers for entry-level positions.",
    icon: "🧰"
  },
  {
    title: "Pre-Employment Screening",
    description: "Assess character, skills, and past work history before hiring.",
    icon: "✅"
  },
  {
    title: "Industry-Specific Recruitment",
    description: "Specialized staffing for hospitality, security, IT, healthcare and construction.",
    icon: "🏢"
  }
];

// Training services data
const trainingServices = [
  {
    title: "Professional Conduct Training",
    description: "Guide workers on proper workplace behavior and ethics.",
    icon: "🤝"
  },
  {
    title: "Workplace Ethics Training",
    description: "Teach integrity, accountability and responsibility in the workplace.",
    icon: "⚖️"
  },
  {
    title: "Customer Service Training",
    description: "Prepare staff for excellent front-facing customer interactions.",
    icon: "🙋"
  },
  {
    title: "Communication Skills",
    description: "Develop effective professional communication abilities.",
    icon: "💬"
  },
  {
    title: "Onboarding Support",
    description: "Help integrate new hires into company culture and systems.",
    icon: "📌"
  }
];

// Service Category component
const ServiceCategory = ({ title, description, services, backgroundColor, accentColor }) => {
  return (
    <AnimatedSection className="py-16" style={{ backgroundColor }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4 relative inline-block"
            style={{ color: COLORS.dark }}
          >
            <span className="inline-block pb-2 border-b-4" style={{ borderColor: accentColor }}>
              {title}
            </span>
          </motion.h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: COLORS.gray[600] }}>
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg overflow-hidden shadow-md p-6 flex flex-col"
            >
              <div className="text-4xl mb-4" style={{ color: accentColor }}>{service.icon}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.dark }}>{service.title}</h3>
              <p className="flex-grow" style={{ color: COLORS.gray[600] }}>{service.description}</p>
            
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Pricing table component
const PricingTable = () => {
  return (
    <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.gray[100] }}>
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12 relative"
          style={{ color: COLORS.dark }}
        >
          <span className="inline-block pb-2 border-b-4" style={{ borderColor: COLORS.secondary }}>
            Pricing Options
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Pay-Per-Check pricing card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <div className="p-6 text-center border-b border-gray-200">
              <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>Pay-Per-Check</h3>
              <p className="text-sm mt-2" style={{ color: COLORS.gray[600] }}>Perfect for occasional hiring needs</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Basic Background Check - GHS 50 per candidate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Full Employment History - GHS 150 per candidate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Criminal Record Check - GHS 200 per candidate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>No monthly commitment</span>
                </li>
              </ul>
              <Link 
                to="/contact" 
                className="mt-6 block text-center py-2 px-4 rounded-md font-medium transition-all hover:shadow-md text-white"
                style={{ backgroundColor: COLORS.primary }}
              >
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* Small Business pricing card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-lg overflow-hidden shadow-lg border-2"
            style={{ borderColor: COLORS.secondary }}
          >
            <div className="p-6 text-center border-b border-gray-200" style={{ backgroundColor: COLORS.secondary }}>
              <h3 className="text-xl font-bold text-white">Small Business Plan</h3>
              <p className="text-sm mt-2 text-white">GHS 500/month</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Up to 10 background checks monthly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Mix and match verification types</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Database access included</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Priority support</span>
                </li>
              </ul>
              <Link 
                to="/contact" 
                className="mt-6 block text-center py-2 px-4 rounded-md font-medium transition-all hover:shadow-md text-white"
                style={{ backgroundColor: COLORS.secondary }}
              >
                Choose Plan
              </Link>
            </div>
          </motion.div>

          {/* Corporate pricing card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <div className="p-6 text-center border-b border-gray-200">
              <h3 className="text-xl font-bold" style={{ color: COLORS.accent }}>Corporate Plan</h3>
              <p className="text-sm mt-2" style={{ color: COLORS.gray[600] }}>GHS 2000/month</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Up to 50 background checks monthly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>All verification types included</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Full database access</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.secondary }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>Dedicated account manager</span>
                </li>
              </ul>
              <Link 
                to="/contact" 
                className="mt-6 block text-center py-2 px-4 rounded-md font-medium transition-all hover:shadow-md text-white"
                style={{ backgroundColor: COLORS.accent }}
              >
                Choose Plan
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-lg mb-4" style={{ color: COLORS.gray[800] }}>Need a custom enterprise solution?</p>
          <Link 
            to="/contact" 
            className="inline-block py-3 px-8 rounded-md font-medium transform transition-all hover:scale-105 hover:shadow-lg text-white"
            style={{ backgroundColor: COLORS.dark }}
          >
            Contact Us for Enterprise Pricing
          </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

const Services = () => {
    useScrollToTop();

  const [activeSlide, setActiveSlide] = useState(0);
  useScrollToTop();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section with slider - similar to Home page */}
      <section className="relative w-full h-screen">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={1000}
          loop={true}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="absolute inset-0 w-full h-full"
          updateOnWindowResize={true}
          observer={true}
          observeParents={true}
        >
          {serviceHeroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full relative">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-8000"
                  style={{ transitionDuration: '8000ms' }}
                />
                
                {/* Dark Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t" style={{ 
                  background: `linear-gradient(to top, ${COLORS.dark} 0%, ${COLORS.dark}99 30%, ${COLORS.dark}40 100%)` 
                }}></div>

                {/* Slide Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <motion.h1 
                    key={`title-${activeSlide}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-white"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    key={`subtitle-${activeSlide}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-2xl mt-4 max-w-3xl"
                    style={{ color: COLORS.gray[200] }}
                  >
                    {slide.subtitle}
                  </motion.p>

                  {/* Button */}
                  <motion.div
                    key={`buttons-${activeSlide}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="mt-6"
                  >
                    <Link 
                      to="/contact" 
                      className="px-6 py-3 rounded-md font-semibold transform transition-all hover:scale-105 hover:shadow-lg"
                      style={{ 
                        backgroundColor: COLORS.secondary,
                        color: COLORS.dark
                      }}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Services Introduction */}
      <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.white }}>
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6"
            style={{ color: COLORS.dark }}
          >
            Our Comprehensive Services
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg mb-8 max-w-3xl mx-auto"
            style={{ color: COLORS.gray[600] }}
          >
            VeriHire Ghana offers end-to-end solutions for employers seeking reliable workforce verification
            and workers looking to enhance their employability through credible verification.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              {
                icon: "🔍",
                title: "Background Checks",
                description: "Comprehensive verification of employees' history and credentials.",
                color: COLORS.primary
              },
              {
                icon: "👥",
                title: "Recruitment",
                description: "Connect with pre-verified workers across various industries.",
                color: COLORS.secondary
              },
              {
                icon: "📚",
                title: "Training",
                description: "Professional development and workplace conduct training.",
                color: COLORS.accent
              }
            ].map((service, index) => (
              <div
                key={index}
                className="p-6 rounded-lg text-center"
                style={{ backgroundColor: COLORS.gray[100] }}
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: service.color }}>{service.title}</h3>
                <p style={{ color: COLORS.gray[600] }}>{service.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Background Check Services */}
      <ServiceCategory 
        title="Background Check Services"
        description="Our thorough verification process helps employers make informed hiring decisions by confirming candidates' histories and credentials."
        services={backgroundCheckServices}
        backgroundColor={COLORS.gray[100]}
        accentColor={COLORS.primary}
      />

      {/* Recruitment Services */}
      <ServiceCategory 
        title="Recruitment Services"
        description="Connect with pre-verified workers or find the perfect job through our comprehensive recruitment solutions."
        services={recruitmentServices}
        backgroundColor={COLORS.white}
        accentColor={COLORS.secondary}
      />

      {/* Worker Training & Orientation */}
      <ServiceCategory 
        title="Worker Training & Orientation"
        description="Prepare workers for professional success with our specialized training and orientation programs."
        services={trainingServices}
        backgroundColor={COLORS.gray[100]}
        accentColor={COLORS.accent}
      />

      {/* Pricing section */}
      <PricingTable />

      {/* Industry-specific solutions */}
      <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.white }}>
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 relative"
            style={{ color: COLORS.dark }}
          >
            <span className="inline-block pb-2 border-b-4" style={{ borderColor: COLORS.secondary }}>
              Industry-Specific Solutions
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🏨",
                title: "Hospitality",
                description: "Specialized checks for hotels, restaurants, and customer service positions.",
                color: COLORS.primary
              },
              {
                icon: "🔒",
                title: "Security",
                description: "Comprehensive background and criminal history verification for security personnel.",
                color: COLORS.light
              },
              {
                icon: "💻",
                title: "Information Technology",
                description: "Skills verification and credential checks for IT professionals.",
                color: COLORS.dark
              },
              {
                icon: "🏥",
                title: "Healthcare",
                description: "Medical qualification verification and conduct checks for healthcare workers.",
                color: COLORS.accent
              },
              {
                icon: "🏗️",
                title: "Construction",
                description: "Trade certification and experience verification for construction workers.",
                color: COLORS.secondary
              },
              {
                icon: "🏢",
                title: "Corporate",
                description: "Executive screening and comprehensive verification for office positions.",
                color: COLORS.primary
              }
            ].map((industry, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-lg overflow-hidden shadow-md p-6 border-t-4"
                style={{ borderColor: industry.color }}
              >
                <div className="text-4xl mb-4">{industry.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: industry.color }}>{industry.title}</h3>
                <p style={{ color: COLORS.gray[600] }}>{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Call to Action Section */}
      <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.dark }}>
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
          >
            Ready to Get Started?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: COLORS.gray[700] }}
          >
            Make informed hiring decisions or get verified as a job seeker with Ghana's leading verification service.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link 
              to="/hire-submission" 
              className="px-8 py-4 rounded-md font-semibold transform transition-all hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: COLORS.secondary,
                color: COLORS.dark
              }}
            >
              For Employers
            </Link>
            <Link 
              to="/hire-submission"
              className="border-2 px-8 py-4 rounded-md font-semibold transform transition-all hover:scale-105 hover:shadow-lg hover:bg-white hover:text-dark"
              style={{ 
                borderColor: COLORS.secondary,
                color: COLORS.secondary
              }}
            >
              For Job Seekers
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Services;