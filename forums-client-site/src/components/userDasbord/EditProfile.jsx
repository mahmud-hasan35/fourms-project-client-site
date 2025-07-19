import React, { useState } from "react";
import { FiUser, FiImage, FiX, FiEdit3 } from "react-icons/fi";

function EditProfile({ userData, onClose, onSave }) {
    console.log(userData);
    
  const [name, setName] = useState(userData?.name || "");
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, photoURL });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          <FiX />
        </button>

        <h2 className="text-2xl font-bold text-purple-600 mb-5 flex items-center">
          <FiEdit3 className="mr-2" />
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <FiUser className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Photo URL Input */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Photo URL</label>
            <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <FiImage className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full outline-none"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
