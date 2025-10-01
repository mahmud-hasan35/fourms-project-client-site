import React from "react";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Pages/LoadingPage/LoadingPage";

function AllTag({ onTagClick }) {
  const axiosSecure = useAxiosSecure();

  const { data: tags = [], isLoading, isError } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tags-all");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center text-lg font-semibold py-6">
        Failed to load tags. Please try again later.
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
          Explore <span className="text-pink-600">Tags</span>
        </h3>
        <p className="text-gray-500 mt-2 text-base md:text-lg">
          Discover categories and filter content that matters to you
        </p>
      </div>

      {/* Tag Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {tags?.map((tag) => (
          <button
            key={tag}
            aria-label={`Filter by ${tag}`}
            onClick={() => onTagClick(tag)}
            className="px-5 py-2.5 rounded-full text-sm md:text-base font-medium 
              bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 
              border border-pink-200 shadow-sm
              hover:from-pink-100 hover:to-pink-200 hover:text-pink-800 
              hover:shadow-md active:scale-95
              transition-all duration-200 ease-in-out"
          >
            #{tag}
          </button>
        ))}
      </div>
    </section>
  );
}

export default AllTag;
