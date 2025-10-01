import React from "react";
import useAxiosSecure from "../Hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Pages/LoadingPage/LoadingPage";
function AllTag({ onTagClick }) {
   const axiosSecure = useAxiosSecure();

   const { data: tags = [], isLoading, isError } = useQuery({
      queryKey: ["tags"],
      queryFn: async () => {
         const res = await axiosSecure.get("/tags-all");
         return res.data; 
      }
   });

   if (isLoading) {
      return <Loading />;
   }

   if (isError) {
      return <div className="text-red-500 text-center">Loading tag problem </div>;
   }
  
   return (
      <div className="max-w-4xl mx-auto  p-4 ">
         <h3 className="font-bold mb-2 text-center text-4xl">All Tags</h3>
         <div className="flex flex-wrap gap-2 justify-center items-center pt-9">
            {tags?.map((tag)=> (
               <button
                  key={tag}
                  className="bg-pink-600 text-white px-3 py-1 rounded-full hover:bg-gray-400"
                  onClick={() => onTagClick(tag)}
               >
                  {tag}
               </button>
            ))}
         </div>
      </div>
   );
}

export default AllTag;
