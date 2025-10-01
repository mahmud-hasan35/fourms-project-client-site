import React, { useEffect, useState } from "react";
import {
   FiUser,
   FiMail,
   FiCalendar,
   FiAward,
   FiFileText,
   FiBookOpen,
} from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import useAuth from "../../Hook//useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";

function MyProfile() {
   const { user } = useAuth();
   const axiosSecure = useAxiosSecure();

   const [userData, setUserData] = useState(null);
   const [recentPosts, setRecentPosts] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (user?.email) {
         setIsLoading(true);
         Promise.all([
            axiosSecure.get(`/users/${user.email}`),
            axiosSecure.get(`/posts/user/${user.email}`),
         ])
             .then(([userRes, postsRes]) => {
            setUserData(userRes.data);
            const posts = Array.isArray(postsRes.data.posts) ? postsRes.data.posts : [];
            const sorted = posts.sort(
               (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setRecentPosts(sorted);
         })
         .catch((error) => console.error("Error fetching data:", error))
         .finally(() => setIsLoading(false));
   }
}, [user, axiosSecure]);

   const totalComments = recentPosts.reduce(
      (acc, post) => acc + (post.comments?.length || 0),
      0
   );

   if (isLoading) {
      return (
         <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  My Profile
               </h1>
               <p className="text-lg text-gray-600 mt-2">
                  Welcome to your personal dashboard
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
               {/* Profile Sidebar */}
               <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                     <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
                        <div className="relative inline-block">
                           <img
                              src={
                                 user?.photoURL ||
                                 "https://i.ibb.co/YXy1D4d/default-profile.png"
                              }
                              alt="Profile"
                              className="w-32 h-32 rounded-full object-cover border-4 border-white/80 shadow-lg mx-auto"
                           />
                           {userData?.badges && (
                              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                                 <span
                                    className={`px-3 py-1 text-xs rounded-full font-bold flex items-center
                                       ${
                                          userData.badges === "gold"
                                             ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                                             : userData.badges === "bronze"
                                             ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white"
                                             : "bg-gray-500 text-white"
                                       }`}
                                 >
                                    <FiAward className="mr-1" />
                                    {userData.badges.toUpperCase()}
                                 </span>
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

                     <div className="p-3 mt-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                           <FiUser className="mr-2 text-purple-600" />
                           User Stats
                        </h3>
                        <ProfileStat
                           icon={<BsPostcard className="text-purple-600" />}
                           label="Total Posts"
                           value={recentPosts.length || 0}
                           bg="bg-purple-50"
                        />
                        <ProfileStat
                           icon={<FaRegCommentDots className="text-indigo-600" />}
                           label="Comments"
                           value={totalComments}
                           bg="bg-indigo-50"
                        />
                        <ProfileStat
                           icon={<FiCalendar className="text-purple-600" />}
                           label="Member Since"
                           value={
                              userData?.createdAt
                                 ? new Date(userData.createdAt).toLocaleDateString()
                                 : "N/A"
                           }
                           bg="bg-gradient-to-r from-purple-50 to-indigo-50"
                        />
                     </div>
                  </div>
               </div>

               {/* Recent Posts Section */}
               <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                     <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <h3 className="text-xl font-semibold text-white flex items-center">
                           <FiFileText className="mr-2" />
                           Recent Activity
                        </h3>
                     </div>

                     <div className="p-6">
                        {recentPosts.length === 0 ? (
                           <NoPosts />
                        ) : (
                           <div className="space-y-6">
                              {recentPosts.slice(0).map((post) => (
                                 <PostCard key={post._id} post={post} />
                              ))}

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

const ProfileStat = ({ icon, label, value, bg }) => (
   <div className={`flex items-center p-3 ${bg} rounded-lg`}>
      <div className="p-2 bg-white rounded-full mr-3 shadow">{icon}</div>
      <div>
         <p className="text-sm text-gray-500">{label}</p>
         <p className="font-bold text-gray-800">{value}</p>
      </div>
   </div>
);

const NoPosts = () => (
   <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
         <FiFileText className="text-purple-600 text-3xl" />
      </div>
      <h4 className="text-xl font-medium text-gray-700">No posts yet</h4>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">
         You haven't created any posts yet. Start sharing your thoughts with the community!
      </p>
   </div>
);

const PostCard = ({ post }) => (
   <div className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
         <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-800">{post.title}</h4>
            <div className="flex items-center text-gray-500 mt-2">
               <FiCalendar className="mr-2 text-purple-500" />
               <span className="text-sm">
                  {new Date(post.createdAt).toLocaleString()}
               </span>
            </div>
         </div>
<button
  className="p-3 bg-green-100 text-green-700 rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
  aria-label="View Post"
>
  <FiBookOpen className="text-xl" />
</button>
      </div>

      {post.tags?.length > 0 && (
         <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, i) => (
               <span
                  key={i}
                  className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded"
               >
                  #{tag}
               </span>
            ))}
         </div>
      )}
   </div>
);

export default MyProfile;
