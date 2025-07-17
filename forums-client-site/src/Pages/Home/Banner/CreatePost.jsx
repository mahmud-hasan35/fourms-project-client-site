import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import UseAuth from '../../../Hook/UseAuth';

const CreatePost = () => {
  const { user } = UseAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim().length < 10) {
      setMessage('❌ Content must be at least 10 characters long.');
      return;
    }

    const cleanedTags = [...new Set(tags.split(',').map(tag => tag.trim().toLowerCase()))];

    const post = {
      title,
      tags: cleanedTags,
      description,
      content,
      authorImage: user?.photoURL || 'https://i.ibb.co/0j1Y3Mh/user.png',
      authorName: user?.displayName || 'Anonymous',
      postTime: new Date().toLocaleString(),
      comments: [],
      commentsCount: 0,
      votesCount: 0,
      votedUsers: [],
      createdAt: new Date().toISOString()
    };

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/posts', post);
      if (res.data.insertedId || res.data.acknowledged) {
        setMessage('✅ Post created successfully!');
        setTitle('');
        setTags('');
        setDescription('');
        setContent('');

        setTimeout(() => {
          navigate('/posts');
        }, 1500);
      } else {
        setMessage('❌ Failed to create post.');
      }
    } catch (err) {
      setMessage('❌ Error creating post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded h-20"
        />

        <textarea
          placeholder="Full Content (minimum 10 characters)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-4 py-2 rounded h-32"
        />
        <p className="text-right text-xs text-gray-500">{content.length}/500</p>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Posting...' : 'Submit Post'}
        </button>

        {message && (
          <p
            className={`text-center mt-2 font-medium ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
