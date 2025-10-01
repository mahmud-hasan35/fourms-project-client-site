

import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
   FacebookShareButton,
   FacebookIcon,
   WhatsappShareButton,
   WhatsappIcon,
} from "react-share";
import Comments from "./Comments";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuth from "../../Hook/useAuth";
import Loading from "../../Pages/LoadingPage/LoadingPage";

function PostDetailsPage() {
   const { id } = useParams();
   const axiosSecure = useAxiosSecure();
   const { user } = useAuth();
   const [userVote, setUserVote] = useState("");
   const queryClient = useQueryClient();

   const {
      data: post,
      isLoading,
      refetch,
   } = useQuery({
      queryKey: ["post", id],
      queryFn: async () => {
         const res = await axiosSecure.get(`/posts/${id}`);
         return res.data;
      },
   });

   // Set userVote based on fetched post & user
   useEffect(() => {
      if (post && user) {
         const up = post.upVoters || [];
         const down = post.downVoters || [];
         if (up.includes(user.email)) setUserVote("upvote");
         else if (down.includes(user.email)) setUserVote("downvote");
         else setUserVote("");
      }
   }, [post, user]);

   const handleVote = async (type) => {
      if (!user) return alert("Please login first");
      if (userVote === type) return;

      try {
         await axiosSecure.patch(`/posts/${id}/${type}`, {
            userEmail: user.email,
         });

         // Optimistic update for better UX
         setUserVote(type);
         await refetch(); // re-fetch post details
         queryClient.invalidateQueries(["posts"]); // update posts list
      } catch (error) {
         console.error("Vote failed:", error);
         alert("Something went wrong while voting.");
      }
   };

   if (isLoading || !post) return <Loading></Loading>;

   const shareUrl = window.location.href;

   return (
      <div className="max-w-4xl mx-auto my-6 p-4 bg-white rounded shadow">
         <div className="flex items-center gap-4 mb-4">
            <img src={post.authorImage} alt="Author" className="w-14 h-14 rounded-full" />
            <div>
               <h2 className="text-2xl font-bold">{post.title}</h2>
               <p className="text-sm text-gray-600">By {post.author}</p>
               <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
               <p className="text-sm text-blue-600">Tags: {post.tags?.join(", ")}</p>
            </div>
         </div>

         <p className="mt-2 text-gray-800">{post.description}</p>

         <div className="mt-4 flex flex-wrap gap-4 items-center">
            <button
               onClick={() => handleVote("upvote")}
               className={`px-4 py-2 rounded text-white transition ${userVote === "upvote" ? "bg-green-700" : "bg-green-500 hover:bg-green-600"
                  }`}
            >
               👍 UpVote ({post.upVote || 0})
            </button>

            <button
               onClick={() => handleVote("downvote")}
               className={`px-4 py-2 rounded text-white transition ${userVote === "downvote" ? "bg-red-700" : "bg-red-500 hover:bg-red-600"
                  }`}
            >
               👎 DownVote ({post.downVote || 0})
            </button>

            <FacebookShareButton url={shareUrl} quote={post.title}>
               <FacebookIcon size={32} round />
            </FacebookShareButton>

            <WhatsappShareButton url={shareUrl} title={post.title}>
               <WhatsappIcon size={32} round />
            </WhatsappShareButton>
         </div>

         <Comments postTitle={post.title} postId={post._id} />
      </div>
   );
}

export default PostDetailsPage;

