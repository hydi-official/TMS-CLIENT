import React from 'react';
import logo from "../../assets/images/logo.png";
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t-4 border-gray-200 px-6 md:px-20 lg:px-16 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border border-[#252161] rounded-lg p-6">
          {/* Logo and Company Description */}
          <div className="space-y-4">
            <img src={logo} alt="VeriHire Ghana Logo" className="h-24" />
            <p className="text-sm text-gray-600 max-w-md">
              VeriHire Ghana is a background verification and a professional recruitment service designed to help 
              businesses make informed hiring decisions. We provide authentic employment verification services 
              and create a secure job-seeking environment.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#252161]">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <span className="h-1 w-1 bg-gray-600 rounded-full mr-2"></span>
                <a href="mailto:info@verihireghana.com" className="hover:text-[#252161] transition-colors">
                  info@verihireghana.com
                </a>
              </li>
              <li className="flex items-center text-gray-600">
                <span className="h-1 w-1 bg-gray-600 rounded-full mr-2"></span>
                <a href="tel:030981238" className="hover:text-[#252161] transition-colors">
                  030 981 238
                </a>
              </li>
              <li className="flex items-center text-gray-600">
                <span className="h-1 w-1 bg-gray-600 rounded-full mr-2"></span>
                <a href="tel:0247030590" className="hover:text-[#252161] transition-colors">
                  0247 030 590
                </a>
              </li>
              <li className="flex items-center text-gray-600">
                <span className="h-1 w-1 bg-gray-600 rounded-full mr-2"></span>
                <span>Accra, Ghana</span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#252161]">Navigation</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-[#252161] transition-colors">
                <Link to="/">Home</Link>
              </li>
              <li className="text-gray-600 hover:text-[#252161] transition-colors">
                <Link to="/about">About Us</Link>
              </li>
              <li className="text-gray-600 hover:text-[#252161] transition-colors">
                <Link to="/about">Services</Link>
              </li>
              <li className="text-gray-600 hover:text-[#252161] transition-colors">
                <Link to="/how-it-works">How It Works</Link>
              </li>
              
              <li className="text-gray-600 hover:text-[#252161] transition-colors">
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-4 ">
          <p className="text-sm text-[#252161] mb-4 md:mb-0">
            © 2025 VeriHire Ghana | All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-[#252161] hover:text-opacity-80 transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-[#252161] hover:text-opacity-80 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-[#252161] hover:text-opacity-80 transition-colors">
              <FaXTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;