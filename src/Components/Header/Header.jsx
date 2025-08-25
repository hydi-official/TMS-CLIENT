import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/logo.png';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;
  
  // Function to check if a dropdown item's path is active
  const isDropdownActive = () => {
    const dropdownPaths = ['/bgl-machines', '/bgl-mining', '/bgl-homes'];
    return dropdownPaths.some(path => location.pathname === path);
  };

  // Navigation links
  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/about', label: 'ABOUT US' },
    { path: '/services', label: 'SERVICES' },

    { path: '/how-it-works', label: 'HOW IT WORKS' },
    { path: '/hire-submission', label: 'HIRE SUBMISSION' },

    { path: '/contact', label: 'CONTACT US' },



  ];
  

  // Variants for mobile menu animation
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3
      }
    }
  };
  
  // Variants for dropdown animation
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -5,
      height: 0,
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 py-2 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-md"
    >
      {/* Logo Section */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="flex items-center"
      >
        <Link to="/">
          <img 
            src={logo}
            alt="BGL Group" 
            className="h-16 w-auto object-contain"
          />
        </Link>
      </motion.div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 text-md font-semibold">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`flex items-center space-x-2 transition-all duration-300 ${
              isActive(link.path) 
                ? 'text-blue-700 font-bold' 
                : 'text-gray-900 hover:text-blue-700'
            }`}
          >
            <span>{link.label}</span>
          </Link>
        ))}
        
    
      </nav>

      {/* Call-to-Action Button */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:block"
      >
        <Link 
          to="/login" 
          className="bg-indigo-900 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-indigo-800 transition-colors shadow-md"
        >
          Login
        </Link>
      </motion.div>

      {/* Mobile Menu Toggle */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-indigo-900"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-16 right-0 w-64 bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4 md:hidden border border-white/20"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    isActive(link.path) 
                      ? 'bg-blue-100/80 text-blue-700 font-bold' 
                      : 'text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              
            
              
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center space-x-2 bg-indigo-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-800 shadow-md"
              >
                <span>Login</span>
              </Link>

             
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;