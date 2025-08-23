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
    <section className="max-w-5xl mx-auto p-6">
      <h3 className="font-extrabold mb-6 text-center text-3xl md:text-4xl text-gray-800">
        Explore Tags
      </h3>

      <div className="flex flex-wrap gap-3 justify-center items-center">
        {tags?.map((tag) => (
          <button
            key={tag}
            aria-label={`Filter by ${tag}`}
            className="bg-pink-600 text-white px-5 py-2 rounded-full font-medium shadow-sm hover:bg-pink-700 focus:ring-2 focus:ring-pink-400 focus:outline-none transition duration-200"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}

export default AllTag;

