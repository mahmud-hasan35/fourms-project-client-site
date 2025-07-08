import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';  // react-router-dom এ পরিবর্তন
import TagSection from './TagSection';

const Banner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // সার্চ হ্যান্ডলার
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/posts/search?tag=${searchTerm}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch posts. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ট্যাগ থেকে সার্চ হ্যান্ডলার
  const handleSearchFromTag = async (tag) => {
    if (!tag.trim()) {
      setResults([]);
      setError('');
      return;
    }
    setSearchTerm(tag);
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/posts/search?tag=${tag}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch posts. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ইনপুটে এন্টার প্রেস ইভেন্ট
  const onInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-gray-100 py-16 px-6 md:px-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="md:w-1/2 space-y-5 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Join the <span className="text-blue-600">Discussion</span><br />
            on Our <span className="text-pink-600">Forum</span>
          </h1>
          <p className="text-gray-700 text-lg">
            Ask questions, share knowledge, and connect with others in our growing community.
          </p>
          <div className="flex justify-center md:justify-start gap-4 pt-4">
            <Link to={'/announcements-add'}>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
              Explore Topics
            </button>
            
            </Link>
            <Link to="/create-post">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition">
                Start a Thread
              </button>
            </Link>
          </div>

          {/* সার্চ বার */}
          <div className="mt-8 flex max-w-md mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Search by tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={onInputKeyDown}
              className="flex-grow px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}  // লোডিং সময় ডিজেবল
              className={`bg-blue-600 text-white px-6 py-2 rounded-r-full font-medium hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
            alt="Forum Illustration"
            className="w-80 h-auto"
          />
        </div>
      </div>

      {/* Tag Section */}
      <div className="mt-12 max-w-4xl mx-auto">
        <TagSection onTagClick={handleSearchFromTag} />
      </div>

      {/* Search Results */}
      <div className="mt-12 max-w-4xl mx-auto px-6 md:px-0">
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && (
          results.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Search Results:</h2>
              <ul className="space-y-3">
                {results.map(post => (
                  <li
                    key={post._id}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
                  >
                    <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
                    <p className="text-sm text-gray-600">
                      Tags: {post.tags.join(', ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Posted on: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : searchTerm ? (
            <p className="text-center text-gray-600">No results found for "{searchTerm}".</p>
          ) : null
        )}
      </div>
    </section>
  );
};

export default Banner;
