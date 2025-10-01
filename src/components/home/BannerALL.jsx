import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hook/useAxiosSecure";
import bannerImage from "../../../src/assets/pexels-kymco-vn-2038166460-34022738.jpg";

function BannerALL() {
  const [searchTag, setSearchTag] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    data: results = [],
    isLoading,
  } = useQuery({
    queryKey: ["searchPosts", searchTag],
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts/search?tag=${searchTag}`);
      return res.data;
    },
    enabled: searchTag.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section
      className="relative bg-cover bg-center py-16 px-6 md:px-20"
      
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r   to-transparent backdrop-blur-sm z-0"></div>

      <div className="relative z-[1] flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-5 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
            Join the <span className="text-blue-600">Discussion</span>
            <br />
            on Our <span className="text-pink-600">Forum</span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Ask questions, share knowledge, and connect with others in our
            growing community. Discover trending topics, join thoughtful
            discussions, and grow your expertise with like-minded individuals.
          </p>

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

            {/* Search Results */}
            {searchTag && !isLoading && results.length > 0 && (
              <div className="absolute top-14 left-0 right-0 bg-white mt-2 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
                {results.map((post) => (
                  <div
                    key={post._id}
                    className="flex gap-3 p-4 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={post.authorImage || "https://i.pravatar.cc/40"}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">{post.title}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {post.description}
                      </p>
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
            src={bannerImage}
            alt="Forum Illustration"
            className="max-w-full h-auto rounded-lg shadow-lg object-cover aspect-[16/9]"
          />
        </div>
      </div>
    </section>
  );
}

export default BannerALL;
