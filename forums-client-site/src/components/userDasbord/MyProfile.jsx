


import React, { useEffect, useState } from "react";

import { FiUser, FiMail, FiCalendar, FiEdit, FiFileText, FiMessageSquare, FiAward } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import UseAuth from "../../Hook/useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";

function MyProfile() {
   const { user } = UseAuth();
   const axiosSecure = useAxiosSecure();
   const [userData, setUserData] = useState(null);
   const [recentPosts, setRecentPosts] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (user?.email) {
         setIsLoading(true);

         Promise.all([
            axiosSecure.get(`/users/${user?.email}`),
            axiosSecure.get(`/posts/user/${user.email}`)
         ])
            .then(([userRes, postsRes]) => {
               setUserData(userRes.data);

               const sorted = postsRes.data.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
               );
               setRecentPosts(sorted.slice(0, 3));
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
      }
   }, [user, axiosSecure]);

   if (isLoading) {
      return (
         <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
         {/* Main Container */}
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  My Profile
               </h1>
               <p className="text-lg text-gray-600 mt-2">Welcome to your personal dashboard</p>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
               {/* Profile Card */}
               <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">
                     {/* Profile Header with Gradient */}
                     <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
                        <div className="relative inline-block">
                           <img
                              src={user?.photoURL || "https://i.ibb.co/YXy1D4d/default-profile.png"}
                              alt="Profile"
                              className="w-32 h-32 rounded-full object-cover border-4 border-white/80 shadow-lg mx-auto"
                           />
                           {userData?.badges && (
                              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                                 {userData.badges === "gold" ? (
                                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs flex items-center font-bold">
                                       <FiAward className="mr-1" /> GOLD
                                    </span>
                                 ) : userData.badges === "bronze" ? (
                                    <span className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-3 py-1 rounded-full text-xs flex items-center font-bold">
                                       <FiAward className="mr-1" /> BRONZE
                                    </span>
                                 ) : (
                                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                       MEMBER
                                    </span>
                                 )}
                              </div>
                           )}
                        </div>
                        <h2 className="text-xl font-bold text-white mt-4">
                           {user?.displayName || userData?.name || "User"}
                        </h2>
                        <p className="text-purple-100 mt-1 flex items-center justify-center">
                           <FiMail className="mr-2" /> {user?.email}
                        </p>
                     </div>

                     {/* Profile Body */}
                     <div className="p-6">
                        <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md flex items-center justify-center">
                           <FiEdit className="mr-2" /> Edit Profile
                        </button>

                        {/* Stats */}
                        <div className="mt-8 space-y-4">
                           <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                              <FiUser className="mr-2 text-purple-600" />
                              User Stats
                           </h3>

                           <div className="space-y-3">
                              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                                 <div className="p-2 bg-purple-100 rounded-full mr-3">
                                    <BsPostcard className="text-purple-600" />
                                 </div>
                                 <div>
                                    <p className="text-sm text-gray-500">Total Posts</p>
                                    <p className="font-bold text-gray-800">{userData?.postCount || 0}</p>
                                 </div>
                              </div>

                              <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                                 <div className="p-2 bg-indigo-100 rounded-full mr-3">
                                    <FaRegCommentDots className="text-indigo-600" />
                                 </div>
                                 <div>
                                    <p className="text-sm text-gray-500">Comments</p>
                                    <p className="font-bold text-gray-800">{userData?.commentCount || 0}</p>
                                 </div>
                              </div>

                              <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                                 <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mr-3">
                                    <FiCalendar className="text-purple-600" />
                                 </div>
                                 <div>
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="font-bold text-gray-800">
                                       {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Posts Column */}
               <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20 h-full">
                     <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <h3 className="text-xl font-semibold text-white flex items-center">
                           <FiFileText className="mr-2" />
                           Recent Activity
                        </h3>
                     </div>

                     <div className="p-6">
                        {recentPosts.length === 0 ? (
                           <div className="text-center py-12">
                              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                                 <FiFileText className="text-purple-600 text-3xl" />
                              </div>
                              <h4 className="text-xl font-medium text-gray-700">No posts yet</h4>
                              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                 You haven't created any posts yet. Start sharing your thoughts with the community!
                              </p>
                              <button className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md">
                                 Create Your First Post
                              </button>
                           </div>
                        ) : (
                           <div className="space-y-6">
                              {recentPosts.map((post) => (
                                 <div
                                    key={post._id}
                                    className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                                 >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                       <div className="flex-1">
                                          <h4 className="text-xl font-bold text-gray-800">{post.title}</h4>
                                          <div className="flex items-center text-gray-500 mt-2">
                                             <FiCalendar className="mr-2 text-purple-500" />
                                             <span className="text-sm">
                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                   year: 'numeric',
                                                   month: 'short',
                                                   day: 'numeric',
                                                   hour: '2-digit',
                                                   minute: '2-digit'
                                                })}
                                             </span>
                                          </div>
                                       </div>
                                       <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all text-sm font-medium whitespace-nowrap shadow-sm">
                                          View Post
                                       </button>
                                    </div>

                                    {post.tags?.length > 0 && (
                                       <div className="flex flex-wrap gap-2 mt-4">
                                          {post.tags.map((tag) => (
                                             <span
                                                key={tag}
                                                className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium"
                                             >
                                                #{tag}
                                             </span>
                                          ))}
                                       </div>
                                    )}

                                    <div className="mt-4 flex items-center text-gray-500">
                                       <FaRegCommentDots className="mr-2 text-indigo-500" />
                                       <span className="text-sm">
                                          {post.comments?.length || 0} comments
                                       </span>
                                    </div>
                                 </div>
                              ))}

                              <div className="pt-6 border-t border-gray-200 text-center">
                                 <button className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                                    View All Posts
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default MyProfile;