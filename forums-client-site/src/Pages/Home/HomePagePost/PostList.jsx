import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UseAuth from '../../../Hook/UseAuth';

const POSTS_PER_PAGE = 5;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const [votedPosts, setVotedPosts] = useState(() => {
    // Load voted posts from localStorage on init
    const saved = localStorage.getItem('votedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  const { user } = UseAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    applySortAndPagination();
  }, [posts, currentPage, sortByPopularity]);

  useEffect(() => {
    // Save votedPosts to localStorage whenever it changes
    localStorage.setItem('votedPosts', JSON.stringify(votedPosts));
  }, [votedPosts]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/posts');
      // Sorting by date on fetch is optional because applySortAndPagination sorts again
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

const handleVote = async (id) => {
  if (votedPosts.includes(id)) {
    alert("You have already voted for this post!");
    return;
  }
  try {
    const res = await axios.patch(`http://localhost:5000/posts/${id}/vote`, { email: user?.email });
    // Suppose backend responds with updated post data:
    const updatedPost = res.data;

    setVotedPosts(prev => [...prev, id]);

    // Update posts with returned updated post
    setPosts(prev =>
      prev.map(post =>
        post._id === id ? updatedPost : post
      )
    );
  } catch (error) {
    console.error("Vote error:", error);
  }
};

  const handleComment = async (id) => {
    // Ideally comment data should be passed, this is a placeholder
    try {
      await axios.patch(`http://localhost:5000/posts/${id}/comment`, { comment: "Sample comment" });

      // Update comment count locally
      setPosts(prev =>
        prev.map(post =>
          post._id === id
            ? {
                ...post,
                commentsCount: (post.commentsCount || 0) + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  const applySortAndPagination = () => {
    let sortedPosts = [...posts];

    if (sortByPopularity) {
      sortedPosts.sort((a, b) => {
        const votesA = (a.upvotes || 0) - (a.downvotes || 0);
        const votesB = (b.upvotes || 0) - (b.downvotes || 0);
        return votesB - votesA;
      });
    } else {
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    setDisplayPosts(paginatedPosts);
  };

  const toggleSort = () => {
    setCurrentPage(1);
    setSortByPopularity(prev => !prev);
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 All Posts</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleSort}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {sortByPopularity ? 'Sort by Newest' : 'Sort by Popularity'}
        </button>

        <p>Page {currentPage} of {totalPages || 1}</p>
      </div>

      {displayPosts.length === 0 ? (
        <p className="text-center">No posts available</p>
      ) : (
        displayPosts.map(post => (
          <div key={post._id} className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={post.author?.picture || 'https://via.placeholder.com/40'}
                alt="author"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{post.author?.name || 'Unknown Author'}</p>
                <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-2">{post.content}</p>

            <div className="flex gap-2 flex-wrap mb-2">
              {post.tags?.map((tag, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <p>👍 {post.votesCount || 0} Votes</p>
              <p>💬 {post.commentsCount || 0} Comments</p>
            </div>

            <div className="flex gap-4 mt-3">
              <button
                onClick={() => handleVote(post._id)}
                disabled={votedPosts.includes(post._id)}
                className={`text-blue-600 hover:underline ${
                  votedPosts.includes(post._id) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {votedPosts.includes(post._id) ? 'Voted' : 'Upvote'}
              </button>
              <button
                onClick={() => handleComment(post._id)}
                className="text-green-600 hover:underline"
              >
                Comment
              </button>
            </div>
          </div>
        ))
      )}

      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum
                ? 'bg-blue-800 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;
