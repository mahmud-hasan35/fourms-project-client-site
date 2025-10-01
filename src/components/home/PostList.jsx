import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hook/useAxiosSecure";
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
  if (error) return <div className="text-center text-red-500">⚠ Error loading posts.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          📝 Forum Posts
        </h2>
        <button
          onClick={() => setSortByPopularity(!sortByPopularity)}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl shadow-md hover:opacity-90 transition"
        >
          {sortByPopularity ? "Sort by Newest" : "Sort by Popularity"}
        </button>
      </div>

      {/* Posts */}
      <div className="grid gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white  p-5 rounded-2xl shadow hover:shadow-lg transition border border-gray-100"
            >
              <PostCard post={post} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 italic">No posts found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap ">
          <button
            disabled={page === 1}
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            className="px-4 cursor-pointer py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                page === idx + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 cursor-pointer rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PostList;
