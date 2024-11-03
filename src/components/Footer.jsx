// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className=" border-t border-gray-300  mt-10  py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between w-full">
          <div className="w-full sm:w-1/4 mb-6 sm:mb-0">
            <h2 className="text-lg font-bold mb-2 cinzel-decorative-bold">PageFM</h2>
            <p className="text-sm">Explore a world of books and more. Join us in discovering and sharing great reads.</p>
          </div>
          <div className="w-full sm:w-1/4 mb-6 sm:mb-0">
            <h3 className="text-md font-semibold mb-2 cinzel-decorative-bold">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/signup" className="hover:underline">Register</Link></li>
              <li><Link to="/bookmarks" className="hover:underline">Bookmarks</Link></li>
            </ul>
          </div>
          <div className="w-full sm:w-1/4 mb-6 sm:mb-0">
            <h3 className="text-md font-semibold mb-2 cinzel-decorative-bold">Contact Us</h3>
            <p className="text-sm">Email: <a href="mailto:pagefmofficial@gmail.com" className="hover:underline">pagefmofficial@gmail.com</a></p>
            <p className="text-sm">Phone: <a href="tel:+91 73592 44428" className="hover:underline">+91 73592 44428</a></p>
          </div>
          <div className="w-full sm:w-1/4">
            <h3 className="text-md font-semibold mb-2 cinzel-decorative-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaFacebookF size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} Bookify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
