import React from "react";
import { FaBullhorn, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";

function Announcement() {
   
   const axiosInstance = useAxiosSecure ();
   const {
      data: announcements = [],
      isLoading,
      isError,
      error,
   } = useQuery({
      queryKey: ["announcements"],
      queryFn: async () => {
         const res = await axiosInstance.get("/announcements");
         return res.data;
      },
   });

   if (isLoading) {
      return (
         <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-indigo-100"></div>
               <p className="text-indigo-600 text-lg font-medium">Loading announcements...</p>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="text-center py-20 bg-red-50 rounded-lg max-w-2xl mx-auto">
            <p className="text-red-500 font-medium">
               Error fetching announcements: {error.message}
            </p>
            <button
               className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
               
            >
               Try Again
            </button>
         </div>
      );
   }

   if (!announcements || announcements.length === 0) {
      return null;
      
   }

   return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-yellow-100 w-16 h-16 rounded-full mb-4">
               <FaBullhorn className="text-yellow-600 text-2xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
               Latest Announcements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               Important updates and news from the team
            </p>
         </div>

         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {announcements?.map((a) => (
               <div
                  key={a._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
               >
                  <div className="p-6">
                     <div className="flex items-start gap-4 mb-4">
                        <img
                           src={a.authorImage}
                           alt={a.authorName || "Author"}
                           className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />

                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {a.title}
                           </h3>
                           <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaUser className="mr-1" size={12} />
                              <span>{a.authorName || "Unknown"}</span>
                           </div>
                        </div>
                     </div>

                     <p className="text-gray-600 mb-6 line-clamp-3">
                        {a.description || a.message}
                     </p>

                     <div className="flex items-center justify-between text-sm text-gray-400 border-t pt-4">
                        <div className="flex items-center">
                           <FaCalendarAlt className="mr-2" size={12} />
                           <time dateTime={a.createdAt}>
                              {new Date(a.createdAt).toLocaleDateString("en-US", {
                                 year: "numeric",
                                 month: "short",
                                 day: "numeric",
                              })}
                           </time>
                        </div>
                        <span className="px-2 py-1 bg-gray-50 rounded-md text-xs">
                           {new Date(a.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                           })}
                        </span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}

export default Announcement;
