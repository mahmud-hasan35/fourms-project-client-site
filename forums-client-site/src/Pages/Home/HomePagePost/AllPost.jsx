import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch posts
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/posts');
        setPosts(res.data.reverse()); // latest first
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">📚 All Posts</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition duration-200 bg-white"
            >
              <div className="flex items-center mb-2">
                <img
                  src={post.author?.picture}
                  alt="author"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm text-gray-600">{post.author?.name || 'Anonymous'}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-blue-700">{post.title}</h3>

              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-700 mt-3 line-clamp-3">
                {post.content.length > 150
                  ? post.content.slice(0, 150) + '...'
                  : post.content}
              </p>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <p>👍 {post.votesCount} votes</p>
                <p>💬 {post.commentsCount} comments</p>
              </div>

              <div className="mt-4 text-right">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPosts;
