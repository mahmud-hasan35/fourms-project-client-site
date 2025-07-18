import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Toaster, toast } from "react-hot-toast";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import UseAuth from "../../Hook/UseAuth";

function PostCard({ post }) {
   const [commentCount, setCommentCount] = useState(0);
   const axiosSecure = useAxiosSecure();
   const { user } = UseAuth();
   const navigate = useNavigate();

   useEffect(() => {
      axiosSecure
         .get(`/comments/count/${encodeURIComponent(post.title)}`)
         .then((res) => setCommentCount(res.data.count));
   }, [post.title, axiosSecure]);

   const voteCount = (post.upVote || 0) - (post.downVote || 0);

   const handleClick = () => {
      if (!user) {
         toast.error("Please login to view post details");
         navigate("/login");
         return;
      }
      navigate(`/post/${post._id}`);
   };

   return (
      <div className="bg-white shadow-md rounded-2xl p-5 mb-5 hover:shadow-lg transition-shadow duration-300 relative">
         <Toaster position="top-center" reverseOrder={false} />
         <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
               src={post.authorImage}
               alt="Author"
               className="w-14 h-14 rounded-full object-cover border"
            />
            <div className="flex-1">
               <button
                  onClick={handleClick}
                  className="text-left text-xl font-semibold text-blue-600 hover:underline"
               >
                  {post.title}
               </button>
               <p className="text-sm text-gray-500 mt-1">
                  By <span className="font-medium">{post.author}</span> •{" "}
                  {new Date(post.createdAt).toLocaleString()}
               </p>
               <div className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Tags:</span>{" "}
                  {post.tags.length ? post.tags.join(", ") : "None"}
               </div>
            </div>
         </div>

         <div className="flex justify-between items-center mt-4 text-gray-700 text-sm">
            <span className="flex items-center gap-1">
               💬 <span>{commentCount} Comments</span>
            </span>
            <span className="flex items-center gap-1">
               👍 <span>{voteCount} Votes</span>
            </span>
         </div>
      </div>
   );
}

export default PostCard;
