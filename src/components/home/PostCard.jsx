import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Toaster, toast } from "react-hot-toast";
import { FaComment, FaThumbsUp, FaTags, FaUser } from "react-icons/fa";
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
      .then((res) => setCommentCount(res.data.count))
      .catch(() => setCommentCount(0));
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
    <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 mb-6 border border-gray-200 overflow-hidden group">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Post Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <img
          src={post.authorImage}
          alt={post.author || "Author"}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
        />
        <div className="flex-1">
          <button
            onClick={handleClick}
            className="text-left text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 hover:underline transition-all duration-200"
          >
            {post.title}
          </button>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <FaUser className="text-gray-400" /> {post.author} •{" "}
            {new Date(post.createdAt).toLocaleString()}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {post.tags.length ? (
              post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                >
                  <FaTags className="text-xs" /> {tag}
                </span>
              ))
            ) : (
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                No Tags
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Post Stats */}
      <div className="flex justify-between items-center mt-6 text-gray-700 text-sm border-t pt-4">
        <span className="flex items-center gap-2">
          <FaComment className="text-gray-500" /> {commentCount} Comments
        </span>
        <span className="flex items-center gap-2">
          <FaThumbsUp className="text-gray-500" /> {voteCount} Votes
        </span>
      </div>

      {/* Subtle Hover Accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-300 rounded-full opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-300"></div>
    </div>
  );
}

export default PostCard;
