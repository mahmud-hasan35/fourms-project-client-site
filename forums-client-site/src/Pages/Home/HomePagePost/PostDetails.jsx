import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import {
  FacebookShareButton,
  FacebookIcon,
} from 'react-share';

const PostDetails = () => {
  const { id } = useParams();
  
   // post ID from route
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [user, setUser] = useState(null); // Replace with your auth logic
  const [loading, setLoading] = useState(true);

  const shareUrl = `${window.location.origin}/post/${id}`;

  useEffect(() => {
    // fetch post by ID
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    // Replace this with your auth system (ex: Firebase or Context)
    const loggedInUser = { name: 'Mahmud', email: 'user@example.com' };
    setUser(loggedInUser);

    fetchPost();
  }, [id]);

  const handleUpvote = async () => {
    if (!user) return alert('Please login to upvote.');
    await axios.patch(`http://localhost:5000/posts/${id}/upvote`);
    setPost((prev) => ({ ...prev, upvote: prev.upvote + 1 }));
  };

  const handleDownvote = async () => {
    if (!user) return alert('Please login to downvote.');
    await axios.patch(`http://localhost:5000/posts/${id}/downvote`);
    setPost((prev) => ({ ...prev, downvote: prev.downvote + 1 }));
  };

  const handleComment = async () => {
    if (!user) return alert('Please login to comment.');
    if (!commentText.trim()) return;

    const newComment = {
      author: user.name,
      text: commentText,
      time: new Date().toISOString(),
    };

    await axios.post(`http://localhost:5000/posts/${id}/comments`, newComment);
    setPost((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));
    setCommentText('');
  };

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      {/* Author Info */}
      <div className="flex items-center mb-4">
        <img
          src={post.author?.picture}
          alt="Author"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="font-semibold">{post.author?.name || 'Anonymous'}</h4>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Title and Content */}
      <h2 className="text-2xl font-bold text-blue-700 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((tag, i) => (
          <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
            #{tag}
          </span>
        ))}
      </div>

      {/* Vote & Share */}
      <div className="flex items-center gap-6 mb-6">
        <button onClick={handleUpvote} className="text-green-600 font-semibold">
          👍 Upvote ({post.upvote || 0})
        </button>
        <button onClick={handleDownvote} className="text-red-600 font-semibold">
          👎 Downvote ({post.downvote || 0})
        </button>

        {user && (
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>

        {user ? (
          <div className="mb-4">
            <textarea
              rows="3"
              className="w-full p-2 border rounded"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              onClick={handleComment}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
            >
              Comment
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">Please login to comment.</p>
        )}

        <div className="space-y-4">
          {post.comments?.map((c, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded shadow-sm">
              <p className="text-sm text-gray-800">{c.text}</p>
              <div className="text-xs text-gray-500 mt-1">
                By {c.author} at {new Date(c.time).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
