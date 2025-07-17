import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import { Link } from "react-router";

function BannerALL() {
   const [searchTag, setSearchTag] = useState("");
   const axiosSecure = useAxiosSecure();

   const {
      data: results = [],
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["searchPosts", searchTag],
      queryFn: async () => {
         const res = await axiosSecure.get(`/posts/search?tag=${searchTag.toUpperCase()}`);
         console.log(res.data);
         return res.data;
         
      },
      enabled: searchTag.trim().length > 0,
      staleTime: 5 * 60 * 1000,
   });

   return (
      <section className="bg-gray-100 py-16 px-6 md:px-20">
         <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 space-y-5 text-center md:text-left">
               <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                  Join the <span className="text-blue-600">Discussion</span><br />
                  on Our <span className="text-pink-600">Forum</span>
               </h1>
               <p className="text-gray-700 text-lg">
                  Ask questions, share knowledge, and connect with others in our growing community.
               </p>
               <div className="flex justify-center md:justify-start gap-4 pt-4">
                 
                     <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                        Explore Topics
                     </button>
                 
                 
                     <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition">
                        Start a Thread
                     </button>
                 
               </div>

               {/* Search Bar */}
               <div className="mt-8 flex max-w-md mx-auto md:mx-0 relative">
                  <input
                     type="text"
                     value={searchTag}
                     onChange={(e) => setSearchTag(e.target.value)}
                     placeholder="Search by tag..."
                     className="flex-grow px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                     disabled
                     className="bg-blue-600 text-white px-6 py-2 rounded-r-full font-medium hover:bg-blue-700 transition"
                  >
                     Search
                  </button>

                  {/* Search Results Dropdown */}
                  {searchTag && !isLoading && results.length > 0 && (
                     <div className="absolute top-14 left-0 right-0 bg-white mt-2 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
                        {results.map((post) => (
                           <div key={post._id} className="flex gap-3 p-4 hover:bg-gray-100 cursor-pointer">
                              <img
                                 src={post.authorImage || "https://i.pravatar.cc/40"}
                                 alt={post.author}
                                 className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="text-left">
                                 <h3 className="font-semibold text-gray-800">{post.title}</h3>
                                 <p className="text-sm text-gray-500 truncate">{post.content}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
                  {searchTag && isLoading && (
                     <div className="absolute top-14 left-0 right-0 bg-white mt-2 rounded-lg shadow p-4 text-center text-sm text-gray-500 z-10">
                        Searching...
                     </div>
                  )}
                  {searchTag && !isLoading && results.length === 0 && (
                     <div className="absolute top-14 left-0 right-0 bg-white mt-2 rounded-lg shadow p-4 text-center text-sm text-gray-500 z-10">
                        No results found.
                     </div>
                  )}
               </div>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 flex justify-center">
               <img
                  src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
                  alt="Forum Illustration"
                  className="w-80 h-auto"
               />
            </div>
         </div>
      </section>
   );
}

export default BannerALL;
