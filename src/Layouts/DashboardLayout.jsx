import React, { useState } from 'react';
import { Link, Outlet } from 'react-router';
import {
   FaUserShield,
   FaUsersCog,
   FaExclamationTriangle,
   FaBullhorn,
   FaBars,
   FaTimes,
} from 'react-icons/fa';
import useUserRole from '../Hook/useUserRole';

function DashboardLayout() {
   const { role, roleLoading } = useUserRole();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
   };

   if (roleLoading) {
      return (
         <div className="flex flex-col items-center justify-center mt-16">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-lg font-medium">
               Loading comments...
            </p>
         </div>
      );
   }

   return (
      <div className="flex h-screen overflow-hidden">
         {/* Mobile Sidebar Toggle Button */}
         <div className="md:hidden fixed top-4 left-4 z-50">
            <button
               onClick={toggleSidebar}
               className="text-3xl text-pink-700 focus:outline-none"
            >
               {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
         </div>

         {/* Sidebar */}
         <div
            className={`fixed md:static z-40 md:z-0 top-0 left-0 h-full w-64 bg-gradient-to-b from-green-500 via-teal-600 to-teal-800 text-white p-6 space-y-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
               } md:translate-x-0 transition-transform duration-300 ease-in-out`}
         >
            {/* Close button inside sidebar for mobile */}
            <div className="flex justify-between items-center md:hidden mb-6">
               <Link to={"/"}>
                  <h2 className="text-xl font-bold">Dashboard</h2>
               </Link>
               <button onClick={toggleSidebar} className="text-2xl text-white">
                  <FaTimes />
               </button>
            </div>

            {/* Dashboard Title (for md and up) */}
            {
               role === 'user' &&
               <Link to="/" className="hidden md:block">
                  <h2 className="text-2xl font-bold mb-4 mt-4">User Dashboard</h2>
               </Link>
            }
            {role === 'admin' &&
               <Link to="/" className="hidden md:block">
                  <h2 className="text-2xl font-bold mb-4 mt-4">Admin Dashboard</h2>
               </Link>
            }

            <ul className="space-y-3 text-lg font-medium mt-4 md:mt-10">

               {/* ✅ Only for Normal Users */}
               {role === 'user' && (
                  <>
                     <li>
                        <Link
                           to="/dashboard/my-profile"
                           className="flex items-center gap-2 hover:text-yellow-300"
                        >
                           <FaUserShield /> My Profile
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="/dashboard/add-post"
                           className="flex items-center gap-2 hover:text-yellow-300"
                        >
                           <FaUserShield /> Add Post
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="/dashboard/my-post"
                           className="flex items-center gap-2 hover:text-yellow-300"
                        >
                           <FaUserShield /> My Post
                        </Link>
                     </li>
                  </>
               )}

               {/* ✅ Only for Admins */}
               {role === 'admin' && (
                  <>
                     <li>
                        <Link
                           to="/dashboard/admin-profile"
                           className="flex items-center gap-2 hover:text-yellow-300"
                        >
                           <FaUserShield /> Admin Profile
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="/dashboard/make-admin"
                           className="flex items-center gap-2 hover:text-yellow-300"
                        >
                           <FaUsersCog /> Manage Users
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="/dashboard/reportcommant"
                           className="flex items-center gap-2 hover:text-yellow-300"
                        >
                           <FaExclamationTriangle /> Reported Activities
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="/dashboard/makeAnnouncement"
                           className="flex items-center gap-2 hover:text-yellow-300"
                        >
                           <FaBullhorn /> Make Announcement
                        </Link>
                     </li>
                  </>
               )}
            </ul>
         </div>

         {/* Main Content */}
         <div className="flex-1 bg-gradient-to-r from-[#e0ecff] via-[#f5e8ff] to-[#d9f3ff] p-6 overflow-auto ml-0">
            <Outlet />
         </div>
      </div>
   );
}

export default DashboardLayout;
