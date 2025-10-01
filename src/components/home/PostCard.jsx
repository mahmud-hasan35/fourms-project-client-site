import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Toaster, toast } from "react-hot-toast";
import { FaComment, FaThumbsUp, FaTags, FaUser } from "react-icons/fa";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuth from "../../Hook//useAuth";

function PostCard({ post }) {
  const [commentCount, setCommentCount] = useState(0);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Author Image */}
        <img
          src={post.authorImage}
          alt={post.author || "Author"}
          className="w-12 h-12 rounded-full object-cover border"
        />

        <div className="flex-1">
          {/* Post Title */}
          <button
            onClick={handleClick}
            className="text-lg font-semibold cursor-pointer text-gray-800 hover:text-blue-600 transition"
          >
            {post.title}
          </button>

          {/* Author Info */}
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <FaUser className="text-gray-400" />
            {post.author} • {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.length ? (
              post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium hover:bg-gray-200 transition"
                >
                  <FaTags className="text-gray-400 text-xs" /> {tag}
                </span>
              ))
            ) : (
              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-xs">
                No Tags
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <FaComment className="text-gray-400" /> {commentCount} Comments
        </span>
        <span className="flex items-center gap-2">
          <FaThumbsUp className="text-gray-400" /> {voteCount} Votes
        </span>
      </div>
    </div>
  );
}

export default PostCard;
