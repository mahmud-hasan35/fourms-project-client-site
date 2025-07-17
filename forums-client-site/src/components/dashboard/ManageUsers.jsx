

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import useAxiosSecure from '../../Hook/useAxiosSecure';
import Swal from 'sweetalert2';

function ManageUsers() {
   const [searchTerm, setSearchTerm] = useState('');
   const queryClient = useQueryClient();
   const axiosSecure = useAxiosSecure();

   const { data, isLoading, isError } = useQuery({
      queryKey: ['users', searchTerm],
      queryFn: async () => {
         const res = await axiosSecure.get(`/users?search=${searchTerm}`);
         return res.data;
      },
      keepPreviousData: true,
   });

   const users = data || [];

   // Make Admin Mutation
   const makeAdminMutation = useMutation({
      mutationFn: (userId) => axiosSecure.patch(`/users/${userId}/make-admin`),
      onSuccess: () => {
         Swal.fire({
            icon: 'success',
            title: 'সফল!',
            text: 'সফলভাবে অ্যাডমিন বানানো হয়েছে',
            timer: 1500,
            showConfirmButton: false,
         });
         queryClient.invalidateQueries(['users']);
      },
      onError: () => {
         Swal.fire({
            icon: 'error',
            title: 'ব্যর্থ!',
            text: 'অ্যাডমিন বানাতে সমস্যা হয়েছে',
         });
      },
   });

   // Remove Admin Mutation
   const removeAdminMutation = useMutation({
      mutationFn: (userId) => axiosSecure.patch(`/users/${userId}/remove-admin`),
      onSuccess: () => {
         Swal.fire({
            icon: 'success',
            title: 'সফল!',
            text: 'অ্যাডমিন রিমুভ করা হয়েছে',
            timer: 1500,
            showConfirmButton: false,
         });
         queryClient.invalidateQueries(['users']);
      },
      onError: () => {
         Swal.fire({
            icon: 'error',
            title: 'ব্যর্থ!',
            text: 'অ্যাডমিন রিমুভ করতে সমস্যা হয়েছে',
         });
      },
   });

   const handleSearchChange = (e) => setSearchTerm(e.target.value);

   const handleMakeAdmin = (userId) => {
      Swal.fire({
         title: 'আপনি কি নিশ্চিত?',
         text: 'এই ইউজারকে অ্যাডমিন বানাতে চান?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'হ্যাঁ, বানান',
         cancelButtonText: 'না',
      }).then((result) => {
         if (result.isConfirmed) {
            makeAdminMutation.mutate(userId);
         }
      });
   };

   const handleRemoveAdmin = (userId) => {
      Swal.fire({
         title: 'আপনি কি নিশ্চিত?',
         text: 'এই ইউজার থেকে অ্যাডমিন স্ট্যাটাস সরাতে চান?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#3085d6',
         confirmButtonText: 'হ্যাঁ, সরান',
         cancelButtonText: 'না',
      }).then((result) => {
         if (result.isConfirmed) {
            removeAdminMutation.mutate(userId);
         }
      });
   };

   if (isLoading) return <p className="text-center mt-4">লোড হচ্ছে...</p>;
   if (isError) return <p className="text-center mt-4 text-red-600">ইউজার লিস্ট আনা যায়নি</p>;

   return (
      <div className="max-w-7xl mx-auto px-4 py-6">
         <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>

         <input
            type="text"
            placeholder="ইউজার নাম দিয়ে সার্চ করুন"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
               <thead className="bg-blue-100">
                  <tr>
                     <th className="p-3">Email</th>
                     <th className="p-3">Role</th>
                     <th className="p-3">Make/Remove Admin</th>
                     <th className="p-3">Subscription</th>
                  </tr>
               </thead>
               <tbody>
                  {users.length === 0 ? (
                     <tr>
                        <td colSpan="4" className="text-center py-6">
                           কোনো ইউজার পাওয়া যায়নি
                        </td>
                     </tr>
                  ) : (
                     users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                           <td className="p-3 break-words">{user.email}</td>
                           <td className="p-3 capitalize">{user.role}</td>
                           <td className="p-3">
                              {user.role === 'admin' ? (
                                 <button
                                    onClick={() => handleRemoveAdmin(user._id)}
                                    disabled={removeAdminMutation.isLoading}
                                    className={`px-4 py-1 text-white rounded transition-all duration-150 ${removeAdminMutation.isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                 >
                                    {removeAdminMutation.isLoading ? 'অপেক্ষা করুন...' : 'Remove Admin'}
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => handleMakeAdmin(user._id)}
                                    disabled={makeAdminMutation.isLoading}
                                    className={`px-4 py-1 text-white rounded transition-all duration-150 ${makeAdminMutation.isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                 >
                                    {makeAdminMutation.isLoading ? 'অপেক্ষা করুন...' : 'Make Admin'}
                                 </button>
                              )}
                           </td>
                           <td className="p-3">{user.badges || 'No Subscription'}</td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}

export default ManageUsers;