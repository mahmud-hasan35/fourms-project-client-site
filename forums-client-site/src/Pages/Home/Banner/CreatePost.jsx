import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = {
      title,
      tags: tags.split(',').map(tag => tag.trim()),
      content,
      createdAt: new Date()
    };

    try {
      const res = await axios.post('http://localhost:5000/posts', post);
      if (res.data.insertedId || res.data.acknowledged) {
        setMessage("✅ Post created successfully!");
        setTitle('');
        setTags('');
        setContent('');
      } else {
        setMessage("❌ Failed to create post.");
      }
    } catch (err) {
      setMessage("❌ Error creating post.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
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
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-4 py-2 rounded h-32"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Post
        </button>
        {message && <p className="text-center text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
