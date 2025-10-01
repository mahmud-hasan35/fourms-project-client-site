import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // ✅ correct import
import { FiMenu, FiX } from "react-icons/fi";
import { AiFillNotification } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo-template.png"
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuth from "../../Hook/UseAuth";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  // ✅ Logout handler
  const handleLogout = () => {
    logOut()
      .then(() => {
        setSidebarOpen(false);
        setDropdownOpen(false);
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  const axiosSecure = useAxiosSecure();

  const { data: announcementCount = 0 } = useQuery({
    queryKey: ["announcementCount"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/announcements/count");


        return res.data.count;
      } catch (err) {
        console.error("❌ Error fetching announcement count:", err);
        return 0;
      }
    },
  });


  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r  via-blue-700 to-indigo-900 shadow-md backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 object-contain"
          />
          <span className="text-2xl font-extrabold tracking-wide select-none">ForumVerse</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-lg font-medium tracking-wide">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/membership" className="hover:text-yellow-300 transition">Membership</Link>
          <button className="relative">
            <AiFillNotification className="text-2xl text-white hover:text-fuchsia-500 transition-colors" />
            {announcementCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
                {announcementCount}
              </span>
            )}
          </button>
        </nav>

        {/* Profile or Join Us */}
        <div className="hidden md:block">
          {!user ? (
            <Link
              to="/login"
              className="bg-white text-purple-700 px-5 py-2 rounded-md font-semibold hover:bg-yellow-300 hover:text-purple-900 transition"
            >
              Join Us
            </Link>
          ) : (
            <div className="relative">
              <img
                src={user.photoURL}
                alt="Profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:ring-2 hover:ring-yellow-300 transition"
              />
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 bg-white text-black shadow-xl rounded-md w-48 overflow-hidden z-50"
                  >
                    <p className="px-4 py-2 border-b font-semibold">{user.displayName}</p>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 transition">Dashboard</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-3xl">
          <FiMenu />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-64 bg-white text-black z-50 shadow-lg flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <span className="text-xl font-bold">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="text-3xl">
                  <FiX />
                </button>
              </div>
              <nav className="flex flex-col p-6 gap-5 text-lg font-medium bg-white">
                <Link to="/" onClick={() => setSidebarOpen(false)} className="hover:text-purple-600 transition">Home</Link>
                <Link to="/membership" onClick={() => setSidebarOpen(false)} className="hover:text-purple-600 transition">Membership</Link>
                <button className="text-left relative hover:text-purple-600 transition"><AiFillNotification /> announcementCount
                  {announcementCount > 0 && (
                    <span className="absolute -top-2 left-2 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                      {announcementCount}
                    </span>
                  )}
                </button>
                {!user ? (
                  <Link to="/login" onClick={() => setSidebarOpen(false)} className="mt-4 bg-purple-600 text-white text-center px-4 py-2 rounded hover:bg-purple-700 transition">
                    Join Us
                  </Link>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="hover:text-purple-600 transition">Dashboard</Link>
                    <button
                      onClick={handleLogout}
                      className="text-left text-red-600 hover:text-red-700 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </motion.div>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-opacity-40 bg-white backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
