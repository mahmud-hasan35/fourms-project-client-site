
import React from 'react';
import { Link } from 'react-router';
import { FaFacebookF, FaTwitter, FaGithub } from 'react-icons/fa';

function Footer() {
   return (
      <footer className="bg-gray-900 text-white mt-10">
         <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
            {/* Website Name */}
            <div>
               <h3 className="text-xl font-bold mb-2 text-blue-400">ForumHub</h3>
               <p className="text-gray-400">Connect, Share & Grow your Knowledge with others.</p>
            </div>

            {/* Quick Links */}
            <div>
               <h4 className="font-semibold mb-2 text-white">Quick Links</h4>
               <ul className="space-y-1">
                  <li><Link to="/" className="hover:underline text-gray-300">Home</Link></li>
                  <li><Link to="/membership" className="hover:underline text-gray-300">Membership</Link></li>
                  <li><Link to="/dashboard" className="hover:underline text-gray-300">Dashboard</Link></li>
               </ul>
            </div>

            {/* Social Media */}
            <div>
               <h4 className="font-semibold mb-2 text-white">Follow Us</h4>
               <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-500">
                     <FaFacebookF />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
                     <FaTwitter />
                  </a>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-300">
                     <FaGithub />
                  </a>
               </div>
            </div>
         </div>

         <div className="border-t border-gray-700 text-center py-4 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ForumHub. All rights reserved.
         </div>
      </footer>
   );
}

export default Footer;
