import React from 'react';
import { Link } from 'react-router';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-9xl font-extrabold text-red-600 mb-4">403</h1>
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Access Denied</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Sorry, you don't have permission to access this page.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Forbidden;
