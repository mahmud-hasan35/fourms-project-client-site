


import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import UseAuth from "../../Hook/useAuth";

function Comments({ postTitle, postId }) {
   const axiosSecure = useAxiosSecure();
   const { user } = UseAuth();
   const [commentText, setCommentText] = useState("");
   const queryClient = useQueryClient();

   const { data: comments = [], isLoading } = useQuery({
      queryKey: ['comments', postTitle],
      queryFn: async () => {
         const res = await axiosSecure.get(`/comments/${encodeURIComponent(postTitle)}`);
         return res.data;
      }
   });

   const commentMutation = useMutation({
      mutationFn: async (newComment) => {
         await axiosSecure.post('/comments', newComment);
      },
      onSuccess: () => {
         setCommentText("");
         queryClient.invalidateQueries({ queryKey: ['comments', postTitle] });
      }
   });

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!user) return alert("Please login to comment");
      if (!commentText.trim()) return;

      commentMutation.mutate({
         postId,
         userEmail: user.email,
         userName: user.displayName || user.email,
         postTitle,
         comment: commentText,
         createdAt: new Date()
      });
   };

   return (
      <div className="mt-6">
         <h3 className="font-semibold mb-2">Comments</h3>

         <form onSubmit={handleSubmit} className="mb-4">
            <textarea
               value={commentText}
               onChange={e => setCommentText(e.target.value)}
               rows={3}
               placeholder="Write your comment..."
               className="w-full border p-2 rounded"
            />
            <button
               type="submit"
               className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
               disabled={commentMutation.isPending}
            >
               {commentMutation.isPending ? "Posting..." : "Comment"}
            </button>
         </form>

         <div>
            {isLoading && <p>Loading comments...</p>}
            {!isLoading && comments.length === 0 && <p>No comments yet</p>}
            {comments.map(c => (
               <div key={c._id} className="border-b py-2">
                  <p><strong>{c.userName}</strong> said:</p>
                  <p>{c.comment}</p>
                  <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
               </div>
            ))}
         </div>
      </div>
   );
}

export default Comments;
