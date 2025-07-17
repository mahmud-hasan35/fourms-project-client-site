import React, { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hook/useAxiosSecure";

function TagsComponent() {
   const axiosSecure = useAxiosSecure();
   const [newTag, setNewTag] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();
      const trimmedTag = newTag.trim();
      if (!trimmedTag) return;

      try {
         const res = await axiosSecure.post("/tags", { name: trimmedTag });

         if (res.data?.tag) {
            toast.success("নতুন ট্যাগ সফলভাবে যোগ করা হয়েছে!");
            setNewTag("");
         } else {
            toast.info("এই ট্যাগটি ইতিমধ্যে বিদ্যমান আছে।");
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "কিছু সমস্যা হয়েছে");
      }
   };

   return (
      <div className="w-full max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
         <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">ট্যাগ যোগ করুন</h3>

         <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
               type="text"
               placeholder="নতুন ট্যাগ লিখুন"
               value={newTag}
               onChange={(e) => setNewTag(e.target.value)}
               required
               className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
               type="submit"
               className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
               যোগ করুন
            </button>
         </form>
      </div>

   );
}

export default TagsComponent;
