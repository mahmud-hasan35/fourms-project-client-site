import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TagSection = ({ onTagClick }) => {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/posts/tags');
        setTags(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load tags');
        setTags([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="bg-gray-50 py-6 px-4 rounded-lg shadow mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Explore Tags</h2>

      {loading && <p className="text-gray-600">Loading tags...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && tags.length === 0 && !error && (
        <p className="text-gray-500">No tags found.</p>
      )}

      <div className="flex flex-wrap gap-3 mt-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm hover:bg-blue-200 transition"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSection;
