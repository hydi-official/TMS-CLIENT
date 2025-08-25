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
import client1 from '../assets/images/client1.jpg';
import client2 from '../assets/images/client2.jpg';
import client3 from '../assets/images/client3.jpg';
import client4 from '../assets/images/client4.jpg'
import client5 from '../assets/images/client5.jpg';
import client6 from'../assets/images/client6.jpg';


// New color palette constants - Teal, Dull Orange (replacing Gold), Crimson, Navy, Emerald theme
const COLORS = {
  primary: '#00838F',    // Teal - Main brand color
  secondary: '#E67E22',  // Dull Orange - Accent/highlight color (replacing #FFB300 Gold)
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

// FAQ Item component for accordion functionality
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="flex justify-between items-center w-full text-left font-semibold focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: COLORS.dark }}
      >
        <span className="text-lg">{question}</span>
        <span 
          className="text-xl transform transition-transform duration-300"
          style={{ color: COLORS.secondary }}
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pt-4 pb-2" style={{ color: COLORS.gray[600] }}>{answer}</p>
      </motion.div>
    </div>
  );
};

const heroSlides = [
  { 
    image: hero1, 
    title: "Welcome to VeriHire Ghana", 
    subtitle: "The Solution to Jobsite Misconduct, Including Internal Theft, Fraud, Dishonesty, and all Other Unethical Behaviors." 
  },
  { 
    image: hero2, 
    title: "Make Informed Hiring Decisions", 
    subtitle: "Detailed Background Checks Within 48-72 Hours" 
  },
  { 
    image: hero3, 
    title: "Protect your Business", 
    subtitle: "Proactive Solutions; Expert Training and Employee Accountability Systems." 
  }
];

// FAQ data
const faqData = [
  {
    question: "How long does the verification process take?",
    answer: "Our standard verification process takes 48-72 hours. For more complex checks or industry-specific verifications, it may take up to 5 business days."
  },
  {
    question: "What information do you need to conduct a background check?",
    answer: "We require basic information such as the candidate's full name, contact details, previous employment history, educational qualifications, and consent for verification. For certain checks, we may request additional documentation."
  },
  {
    question: "How do you ensure data privacy and security?",
    answer: "VeriHire Ghana complies with all data protection regulations in Ghana. We use encrypted systems, secure our databases, and have strict access controls. All information is handled confidentially and only shared with authorized personnel."
  },
  {
    question: "Can job seekers register on your platform?",
    answer: "Yes, job seekers can register on our platform to get verified and join our database of trusted workers. This increases your chances of being matched with quality employers who value pre-verified candidates."
  },
  {
    question: "Do you offer customized verification packages for different industries?",
    answer: "Absolutely! We offer industry-specific verification packages tailored for sectors such as hospitality, security, IT, healthcare, construction, and more. Each package focuses on the relevant checks needed for that particular industry."
  }
];

// Testimonial data
const testimonialData = [
  {
    name: "Sarah Mensah",
    position: "HR Manager, Accra Hotel Group",
    image: client2,
    testimonial: "VeriHire Ghana has transformed our hiring process completely. Their background checks are thorough and reliable, which has helped us build a trustworthy team. We've reduced employee turnover by 40% since we started working with them."
  },
  {
    name: "Kwame Osei",
    position: "Operations Director, SafeGuard Security Services",
    image: client1,
    testimonial: "In the security industry, trustworthiness is non-negotiable. VeriHire's verification services have helped us identify qualified candidates with clean records. Their industry-specific checks are exactly what we needed."
  },
  {
    name: "Ama Boateng",
    position: "CEO, Tech Innovations Ghana",
    image: client5,
    testimonial: "As a growing tech company, we needed to scale our team quickly without compromising on quality. VeriHire's database of pre-verified professionals helped us fill critical positions with confidence. Their 48-hour turnaround time is impressive!"
  },
  {
    name: "Daniel Addo",
    position: "Restaurant Owner, Taste of Ghana",
    image: client3,
    testimonial: "The hospitality training that VeriHire provides to workers before placement is what sets them apart. Every staff member we've hired through them understands customer service fundamentals, which has improved our guest satisfaction ratings."
  },
  {
    name: "Priscilla Nkrumah",
    position: "Construction Manager, BuildRight Ghana",
    image: client6,
    testimonial: "Finding reliable workers in the construction industry has always been challenging. VeriHire's thorough reference checks and skills verification have helped us build teams we can trust on critical projects. Worth every cedi!"
  }
];

const Home = () => {
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

      {/* Highlight Features Section with Animations */}
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
              Why Choose VeriHire Ghana
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "⏱️",
                title: "Fast & Reliable",
                description: "Get verification results within 48-72 hours",
                color: COLORS.primary
              },
              {
                icon: "🔍",
                title: "Industry-Specific",
                description: "Custom background checks for different sectors",
                color: COLORS.light
              },
              {
                icon: "🔒",
                title: "Secure Data",
                description: "Confidentiality and compliance with Ghana's labor laws",
                color: COLORS.dark
              },
              {
                icon: "👥",
                title: "Verified Workforce",
                description: "Direct recruitment from our trusted database",
                color: COLORS.secondary
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
                className="bg-white p-6 rounded-lg text-center transform transition-all hover:shadow-xl hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: feature.color }}>{feature.title}</h3>
                <p style={{ color: COLORS.gray[600] }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Trusted Section with Animations */}
      <AnimatedSection className="py-16" style={{ backgroundColor: COLORS.white }}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 mb-8 md:mb-0"
          >
            <img
              src={hero1}
              alt="Trusted Verification Service"
              className="w-full h-[300px] md:h-[500px] object-cover rounded-lg shadow-lg transform transition-transform hover:scale-[1.02]"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 px-4 md:px-8"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: COLORS.dark }}>
              Ghana's Most Trusted Verification Platform
            </h2>
            <p className="text-base md:text-lg mb-8" style={{ color: COLORS.gray[600] }}>
              Creating a secure and transparent job-seeking environment for businesses and job seekers across Ghana.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center shadow-lg p-4 md:p-6 rounded-lg"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Counter endValue={5000} textColor={COLORS.white} />
                <p style={{ color: COLORS.white }}>Background Checks</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center shadow-lg p-4 md:p-6 rounded-lg"
                style={{ backgroundColor: COLORS.secondary }}
              >
                <Counter endValue={300} textColor={COLORS.dark} />
                <p style={{ color: COLORS.dark }}>Partner Companies</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center shadow-lg p-4 md:p-6 rounded-lg"
                style={{ backgroundColor: COLORS.light }}
              >
                <Counter endValue={150} textColor={COLORS.white} />
                <p style={{ color: COLORS.white }}>Trained Workers</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center shadow-lg p-4 md:p-6 rounded-lg"
                style={{ backgroundColor: COLORS.accent }}
              >
                <Counter endValue={1000} textColor={COLORS.white} />
                <p style={{ color: COLORS.white }}>Successful Placements</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

     {/* Services Section with Cards Animation - Color Only on Buttons */}
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
        Our Comprehensive Services
      </span>
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: "Background Check Services",
          icon: "🔍",
          buttonColor: COLORS.primary,
          items: [
            "Employment Verification",
            "Criminal Record Checks",
            "Reference & Conduct Checks",
            "Educational Verification",
            "Credit & Financial Background"
          ]
        },
        {
          title: "Recruitment Services",
          icon: "👥",
          buttonColor: COLORS.secondary,
          items: [
            "Permanent & Contract Staffing",
            "Skilled & Unskilled Worker Matching",
            "Pre-Employment Screening",
            "Employee Onboarding",
            "Talent Sourcing"
          ]
        },
        {
          title: "Worker Orientation & Training",
          icon: "📚",
          buttonColor: COLORS.accent,
          items: [
            "Professional Conduct Training",
            "Workplace Ethics Training", 
            "Customer Service Training",
            "Communication Skills",
            "Onboarding Support"
          ]
        }
      ].map((service, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 * index, duration: 0.6 }}
          whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-white rounded-lg overflow-hidden shadow-md"
        >
          <div className="p-4 text-center border-b border-gray-200">
            <span className="text-4xl">{service.icon}</span>
            <h3 className="text-xl font-bold mt-2" style={{ color: COLORS.dark }}>{service.title}</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-2">
              {service.items.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2" style={{ color: COLORS.gray[600] }}>✓</span>
                  <span style={{ color: COLORS.gray[800] }}>{item}</span>
                </li>
              ))}
            </ul>
            <Link 
              to="/about" 
              className="mt-6 block text-center py-2 px-4 rounded-md font-medium transition-all hover:shadow-md text-white"
              style={{ backgroundColor: service.buttonColor }}
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</AnimatedSection>
      {/* FAQ Section */}
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
              Frequently Asked Questions
            </span>
          </motion.h2>

          <div className="max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-lg p-6 md:p-8">
            {faqData.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}

            <div className="mt-8 text-center">
              <Link 
                to="/contact" 
                className="inline-block py-3 px-8 rounded-md font-medium transform transition-all hover:scale-105 hover:shadow-lg text-white"
                style={{ backgroundColor: COLORS.accent }}
              >
                Have More Questions? Contact Us
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

  {/* Testimonial Section */}
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
        What Our Clients Say
      </span>
    </motion.h2>

    <div className="max-w-6xl mx-auto">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 }
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={800}
        loop={true}
        pagination={{ clickable: true }}
        className="testimonial-slider"
      >
        {testimonialData.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-5 rounded-lg shadow-lg text-center h-full flex flex-col"
            >
              <div className="flex flex-col items-center h-full">
                <div 
                  className="w-16 h-16 rounded-full overflow-hidden border-4 mb-3"
                  style={{ borderColor: COLORS.secondary }}
                >
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="relative flex-grow">
                  <div className="text-4xl absolute -top-6 -left-2 opacity-20" style={{ color: COLORS.secondary }}>
                    "
                  </div>
                  <p className="text-base italic mb-4 relative z-10" style={{ color: COLORS.gray[600] }}>
                    {testimonial.testimonial}
                  </p>
                  <div className="text-4xl absolute -bottom-6 -right-2 opacity-20" style={{ color: COLORS.secondary }}>
                    "
                  </div>
                </div>
                
                <div className="mt-auto">
                  <h4 className="text-lg font-bold mt-3" style={{ color: COLORS.primary }}>{testimonial.name}</h4>
                  <p className="text-sm" style={{ color: COLORS.gray[600] }}>{testimonial.position}</p>
                  
                  <div className="mt-2 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg mx-0.5" style={{ color: COLORS.secondary }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    
  
  </div>
</AnimatedSection>

      {/* Call to Action Section */}
      <AnimatedSection className="py-8 text-white" style={{ backgroundColor: COLORS.dark }}>
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
          >
            Ready to Build a Trustworthy Workforce?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-800"
          >
            Start making informed hiring decisions with Ghana's leading verification service.
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
              Register Now
            </Link>
            <Link 
              to="/how-it-works" 
              className="border-2 px-8 py-4 rounded-md font-semibold transform transition-all hover:scale-105 hover:shadow-lg hover:bg-white hover:text-dark"
              style={{ 
                borderColor: COLORS.secondary,
                color: COLORS.secondary
              }}
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;