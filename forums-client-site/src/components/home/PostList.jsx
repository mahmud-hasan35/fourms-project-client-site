import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import Loading from "../../Pages/LoadingPage/LoadingPage";
import PostCard from "./PostCard";

function PostList() {
   const [page, setPage] = useState(1);
   const [sortByPopularity, setSortByPopularity] = useState(false);
   const axiosSecure = useAxiosSecure();
   const postsPerPage = 5;

   const fetchPosts = async ({ queryKey: [, page, sort] }) =>
      (await axiosSecure.get(`/posts?page=${page}&sort=${sort ? "popularity" : "newest"}`)).data;
    
   const { data, isLoading, error } = useQuery({
      queryKey: ["posts", page, sortByPopularity],
      queryFn: fetchPosts,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
   });
   

   const posts = data?.posts || [];
   const totalPosts = data?.total || 0;
   const totalPages = Math.ceil(totalPosts / postsPerPage);

   if (isLoading) return <Loading />;
   if (error) return <div>Error loading posts.</div>;

   return (
      <div className="max-w-5xl mx-auto my-6 p-4">
         <h2 className="text-center font-bold space-y-3 text-4xl">All Post </h2>
         <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
            <button
               onClick={() => setSortByPopularity(!sortByPopularity)}
               className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
               {sortByPopularity ? "Sort by Newest" : "Sort by Popularity"}
            </button>
         </div>

         {posts.map((post) => (
            <PostCard key={post._id} post={post} />
         ))}

         {/* Pagination */}
         <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
            <button
               disabled={page === 1}
               onClick={() => setPage((old) => Math.max(old - 1, 1))}
               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
               Prev
            </button>

            {[...Array(totalPages).keys()].map((idx) => (
               <button
                  key={idx}
                  className={`px-3 py-1 border rounded ${page === idx + 1 ? "bg-blue-500 text-white" : ""}`}
                  onClick={() => setPage(idx + 1)}
               >
                  {idx + 1}
               </button>
            ))}

            <button
               disabled={page === totalPages}
               onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
               Next
            </button>
         </div>
      </div>
   );
}

export default PostList;
