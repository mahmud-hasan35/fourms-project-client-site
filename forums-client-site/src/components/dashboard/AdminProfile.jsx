import React from "react";

import TagsComponent from "./TagsComponent";
import {
   PieChart,
   Pie,
   Cell,
   Tooltip,
   ResponsiveContainer,
   Legend,
} from "recharts";
import UseAuth from "../../Hook/useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

function AdminProfile() {
   const { user } = UseAuth();
   const axiosSecure = useAxiosSecure();

   const { data: stats = {}, } = useQuery({
      queryKey: ["admin-stats"],
      queryFn: async () => {
         const res = await axiosSecure.get("/admin-stats");
         return res.data;
      },
   });

   const chartData = [
      { name: "পোস্ট", value: stats.posts || 0 },
      { name: "কমেন্ট", value: stats.comments || 0 },
      { name: "ইউজার", value: stats.users || 0 },
   ];

   


   return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Profile Header */}
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">সিস্টেমের সামগ্রিক পরিসংখ্যান এবং ব্যবস্থাপনা</p>
         </div>

         {/* Profile Card */}
         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
               <img
                  src={user?.photoURL || "https://i.pravatar.cc/150?img=3"}
                  alt="Admin"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
               />
               <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
                  Admin
               </span>
            </div>
            <div className="text-center md:text-left">
               <h2 className="text-2xl font-bold text-gray-800">{user?.displayName}</h2>
               <p className="text-gray-600 mb-2">{user?.email}</p>
               <div className="flex justify-center md:justify-start gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                     সক্রিয়
                  </span>
               </div>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-lg font-medium text-gray-500">মোট পোস্ট</h3>
                     <p className="text-3xl font-bold text-gray-800 mt-2">{stats.posts}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                     <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                     </svg>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-lg font-medium text-gray-500">মোট কমেন্ট</h3>
                     <p className="text-3xl font-bold text-gray-800 mt-2">{stats.comments}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                     <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                     </svg>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-lg font-medium text-gray-500">মোট ইউজার</h3>
                     <p className="text-3xl font-bold text-gray-800 mt-2">{stats.users}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                     <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                     </svg>
                  </div>
               </div>
            </div>
         </div>

         {/* Chart and Tags Section */}
         <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">ডেটা ভিজ্যুয়ালাইজেশন</h3>
                  <div className="flex space-x-2">
                     <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Post
                     </button>
                     <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Comment
                     </button>
                  </div>
               </div>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={chartData}
                           dataKey="value"
                           nameKey="name"
                           cx="50%"
                           cy="50%"
                           outerRadius={80}
                           innerRadius={40}
                           label
                        >
                           {chartData.map((entry, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip
                           formatter={(value) => [`${value} টি`, value === 1 ? 'আইটেম' : 'আইটেম']}
                        />
                        <Legend
                           layout="horizontal"
                           verticalAlign="bottom"
                           align="center"
                           wrapperStyle={{ paddingTop: '20px' }}
                        />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Tags Component Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">ট্যাগ ম্যানেজমেন্ট</h3>
                  <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                     নতুন ট্যাগ
                  </span>
               </div>
               <TagsComponent />
            </div>
         </div>
      </div>
   );
}

export default AdminProfile;