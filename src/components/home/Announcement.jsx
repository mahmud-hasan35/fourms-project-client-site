import React from "react";
import { FaBullhorn, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import { motion } from "framer-motion";

function Announcement() {
  const axiosInstance = useAxiosSecure();
  const { data: announcements = [], isLoading, isError, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosInstance.get("/announcements");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
          <p className="text-blue-600 text-lg font-medium">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 bg-red-50 rounded-xl max-w-2xl mx-auto shadow-md">
        <p className="text-red-600 font-semibold">
          Error fetching announcements: {error?.message || "Unknown error"}
        </p>
        <button
          className="mt-4 px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return <div className="text-center py-20 text-gray-500 font-medium">No announcements found.</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full mb-4 shadow-md">
          <FaBullhorn className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Latest Announcements</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Stay updated with important news and updates from our team.</p>
      </div>

      {/* Grid of animated cards */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((a, idx) => {
          // decide direction by index: even -> from left, odd -> from right
          const fromLeft = idx % 2 === 0;

          return (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, x: fromLeft ? -80 : 80, scale: 0.98 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(idx * 0.08, 0.6) }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Author & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={a.authorImage}
                    alt={a.authorName || "Author"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition cursor-pointer">
                      {a.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FaUser className="mr-1 text-blue-500" size={12} />
                      <span>{a.authorName || "Unknown"}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 line-clamp-4 flex-1">{a.description || a.message}</p>

                {/* Date & Time */}
                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-500" size={14} />
                    <time dateTime={a.createdAt}>
                      {new Date(a.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <span className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md text-xs text-blue-700 font-medium">
                    {new Date(a.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default Announcement;
