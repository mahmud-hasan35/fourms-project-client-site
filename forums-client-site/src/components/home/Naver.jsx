
import React, { useState } from "react";
import { Link } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../Hook/useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";
function Navbar() {
   const { user, logOut } = UseAuth();
   const axiosSecure = useAxiosSecure();
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const [sidebarOpen, setSidebarOpen] = useState(false);

   const { data: announcementCount = 0 } = useQuery({
      queryKey: ["announcementCount"],
      queryFn: async () => {
         const res = await axiosSecure.get("/announcements/count");
         return res.data.count;
      },
   });


   

   return (
      <nav className="bg-gradient-to-r from-[#e0ecff] via-[#f5e8ff] to-[#d9f3ff] text-black px-4 py-3 shadow">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Left: Logo */}
            <div className="flex items-center ">
               <img
                  src="https://i.ibb.co/SDqS4qzK/Logo-for-Chat-Sphere-Forum-Website-removebg-preview.png"
                  alt="Logo"
                  className="w-28 h-16 object-contain"
               />
               <span className="text-xl font-bold">ForumVerse</span>
            </div>

            {/* Middle: Nav Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-6">
               <Link to="/" className="hover:underline text-xl">Home</Link>
               <Link to="/membership" className="hover:underline text-xl">Membership</Link>
               <div className="relative">
                  <button>
                     🔔
                     {announcementCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
                           {announcementCount}
                        </span>
                     )}
                  </button>
               </div>
            </div>

            {/* Right: Auth/Profile */}
            <div className="hidden md:block">
               {!user ? (
                  <Link
                     to="/login"
                     className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white"
                  >
                     Join Us
                  </Link>
               ) : (
                  <div className="relative inline-block">
                     <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                     />
                     {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 py-2 z-10">
                           <p className="px-4 py-2 font-semibold">{user.displayName || user.email}</p>
                           <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">Dashboard</Link>
                           <button
                              onClick={logOut}
                              className="w-full text-left px-4 py-2 hover:bg-gray-200"
                           >
                              Logout
                           </button>
                        </div>
                     )}
                  </div>
               )}
            </div>

            {/* Hamburger for Mobile */}
            <button
               onClick={() => setSidebarOpen(true)}
               className="md:hidden text-3xl text-blue-800"
            >
               <FiMenu />
            </button>
         </div>

         {/* Sidebar (Mobile Drawer) */}
         <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"
               } transition-transform duration-300 ease-in-out z-50`}
         >
            <div className="flex justify-between items-center p-4 border-b">
               <span className="font-bold text-lg">Menu</span>
               <button onClick={() => setSidebarOpen(false)} className="text-2xl">
                  <FiX />
               </button>
            </div>
            <div className="p-4 space-y-4">
               <Link to="/" onClick={() => setSidebarOpen(false)} className="block text-lg">
                  Home
               </Link>
               <Link to="/membership" onClick={() => setSidebarOpen(false)} className="block text-lg">
                  Membership
               </Link>
               <div className="relative">
                  <button className="text-lg">
                     🔔 Announcements
                     {announcementCount > 0 && (
                        <span className="ml-2 bg-red-600 rounded-full text-white text-xs w-5 h-5 inline-flex items-center justify-center">
                           {announcementCount}
                        </span>
                     )}
                  </button>
               </div>
               {!user ? (
                  <Link
                     to="/login"
                     onClick={() => setSidebarOpen(false)}
                     className="bg-blue-600 px-4 py-2 rounded text-white block text-center"
                  >
                     Join Us
                  </Link>
               ) : (
                  <>
                     <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="block text-lg">
                        Dashboard
                     </Link>
                     <button
                        onClick={() => {
                           
                           logOut();
                           setSidebarOpen(false);
                        }}
                        className="block w-full text-left text-lg text-red-600"
                     >
                        Logout
                     </button>
                  </>
               )}
            </div>
         </div>

         {/* Sidebar Overlay */}
         {sidebarOpen && (
            <div
               onClick={() => setSidebarOpen(false)}
               className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
            ></div>
         )}
      </nav>
   );
}

export default Navbar;
