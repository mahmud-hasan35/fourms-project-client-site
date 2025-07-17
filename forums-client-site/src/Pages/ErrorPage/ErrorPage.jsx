import React from 'react';
import { Link } from 'react-router';

function ErrorPage() {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
         <img
            src="https://i.ibb.co/5GzXkwq/404-error.png" 
            alt="404 Not Found"
            className="max-w-xl w-full mb-8"
         />
         <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Page Not Found</h1>
         <p className="text-lg text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
         <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Go to Homepage
         </Link>
      </div>
   );
}

export default ErrorPage;
