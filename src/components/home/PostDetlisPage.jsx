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
import useAuth from "../../Hook/UseAuth";
import Loading from "../../Pages/LoadingPage/LoadingPage";
import { FaThumbsUp, FaThumbsDown, FaTags, FaUser } from "react-icons/fa";

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
      await axiosSecure.patch(`/posts/${id}/${type}`, { userEmail: user.email });
      setUserVote(type);
      await refetch();
      queryClient.invalidateQueries(["posts"]);
    } catch (error) {
      console.error("Vote failed:", error);
      alert("Something went wrong while voting.");
    }
  };

  if (isLoading || !post) return <Loading />;

  const shareUrl = window.location.href;

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Author Info */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <img
          src={post.authorImage}
          alt={post.author}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
        />
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{post.title}</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <FaUser className="text-gray-400" /> {post.author} •{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                >
                  <FaTags className="text-xs" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Description */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">{post.description}</p>

      {/* Vote & Share Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={() => handleVote("upvote")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition ${
            userVote === "upvote" ? "bg-green-700" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <FaThumbsUp /> UpVote ({post.upVote || 0})
        </button>

        <button
          onClick={() => handleVote("downvote")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition ${
            userVote === "downvote" ? "bg-red-700" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          <FaThumbsDown /> DownVote ({post.downVote || 0})
        </button>

        <FacebookShareButton url={shareUrl} quote={post.title}>
          <FacebookIcon size={36} round />
        </FacebookShareButton>

        <WhatsappShareButton url={shareUrl} title={post.title}>
          <WhatsappIcon size={36} round />
        </WhatsappShareButton>
      </div>

      {/* Comments Section */}
      <Comments postTitle={post.title} postId={post._id} />
    </div>
  );
}

export default PostDetailsPage;
