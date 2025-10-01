import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../Hook/useAxiosSecure';
import Swal from 'sweetalert2';

function ManageUsers() {
   const [searchTerm, setSearchTerm] = useState('');
   const queryClient = useQueryClient();
   const axiosSecure = useAxiosSecure();

   const { data, isLoading, isError, isFetching } = useQuery({
      queryKey: ['users', searchTerm],
      queryFn: async () => {
         const res = await axiosSecure.get(`/users?search=${searchTerm}`);
         return res.data;
      },
      keepPreviousData: true,
   });

   const users = data || [];

   const makeAdminMutation = useMutation({
      mutationFn: (userId) => axiosSecure.patch(`/users/${userId}/make-admin`),
      onSuccess: () => {
         Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'User has been promoted to admin successfully.',
            timer: 1500,
            showConfirmButton: false,
         });
         queryClient.invalidateQueries(['users']);
      },
      onError: () => {
         Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Failed to promote the user to admin.',
         });
      },
   });

   const removeAdminMutation = useMutation({
      mutationFn: (userId) => axiosSecure.patch(`/users/${userId}/remove-admin`),
      onSuccess: () => {
         Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Admin role has been removed successfully.',
            timer: 1500,
            showConfirmButton: false,
         });
         queryClient.invalidateQueries(['users']);
      },
      onError: () => {
         Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Failed to remove admin role from the user.',
         });
      },
   });

   const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
   };

   const handleMakeAdmin = (userId) => {
      Swal.fire({
         title: 'Are you sure?',
         text: 'Do you want to promote this user to admin?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, Promote',
         cancelButtonText: 'Cancel',
      }).then((result) => {
         if (result.isConfirmed) {
            makeAdminMutation.mutate(userId);
         }
      });
   };

   const handleRemoveAdmin = (userId) => {
      Swal.fire({
         title: 'Are you sure?',
         text: 'Do you want to remove admin role from this user?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#3085d6',
         confirmButtonText: 'Yes, Remove',
         cancelButtonText: 'Cancel',
      }).then((result) => {
         if (result.isConfirmed) {
            removeAdminMutation.mutate(userId);
         }
      });
   };

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center mt-16">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-lg font-medium">
               Loading users...
            </p>
         </div>
      );
   }

   if (isError) {
      return <p className="text-center mt-4 text-red-600">Failed to load user list.</p>;
   }

   return (
      <div className="max-w-7xl mx-auto px-4 py-6">
         <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>

         <input
            type="text"
            placeholder="Search by user name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

         {/* Show loading spinner while typing/searching */}
         {isFetching && (
            <div className="flex items-center gap-2 text-blue-600 mb-4">
               <div className="w-5 h-5 border-2 border-blue-500 border-dashed rounded-full animate-spin"></div>
               <span className="text-sm">Searching users...</span>
            </div>
         )}

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
                           No users found.
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
                                    className={`px-4 py-1 text-white rounded transition-all duration-150 ${
                                       removeAdminMutation.isLoading
                                          ? 'bg-gray-400 cursor-not-allowed'
                                          : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                 >
                                    {removeAdminMutation.isLoading ? 'Please wait...' : 'Remove Admin'}
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => handleMakeAdmin(user._id)}
                                    disabled={makeAdminMutation.isLoading}
                                    className={`px-4 py-1 text-white rounded transition-all duration-150 ${
                                       makeAdminMutation.isLoading
                                          ? 'bg-gray-400 cursor-not-allowed'
                                          : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                 >
                                    {makeAdminMutation.isLoading ? 'Please wait...' : 'Make Admin'}
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
