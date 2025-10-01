import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { FiTrash2, FiChevronLeft, FiChevronRight, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { FaRegSadTear } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../Hook/UseAuth';
import useAxiosSecure from '../../Hook/useAxiosSecure';
import Loading from '../../Pages/LoadingPage/LoadingPage';

function MyPost() {
   const { user } = useAuth();
   const axiosSecure = useAxiosSecure();
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   const [page, setPage] = useState(1);
   const limit = 10;

   const { data = {}, isLoading, isError } = useQuery({
      queryKey: ['userPosts', user?.email, page],
      queryFn: async () => {
         const res = await axiosSecure.get(`/user/posts?email=${user?.email}&page=${page}&limit=${limit}`);

         return res.data;
      },
      enabled: !!user?.email,
   });

   const deleteMutation = useMutation({
      mutationFn: async (postId) => {
         await axiosSecure.delete(`/posts/${postId}`);
      },
      onSuccess: () => {
         queryClient.invalidateQueries(['userPosts', user?.email]);
      },
   });

   const handleDelete = (id) => {
      Swal.fire({
         title: 'Are you sure?',
         text: "You want to delete this post!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#3085d6',
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'Cancel'
      }).then((result) => {
         if (result.isConfirmed) {
            deleteMutation.mutate(id);
            Swal.fire(
               'Deleted!',
               'Your post has been deleted.',
               'success'
            );
         }
      });
   };

   const totalPages = Math.ceil(data?.totalPosts / limit);

   if (isLoading) return <Loading />;
   if (isError) return (
      <div className="max-w-6xl mx-auto p-4">
         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
            <div className="flex items-center">
               <FiAlertCircle className="text-red-500 text-2xl mr-2" />
               <p className="text-red-700 font-medium">Failed to fetch data</p>
            </div>
         </div>
      </div>
   );

   return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
         <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-b from-green-500 via-teal-600 to-teal-800 px-6 py-4">
               <h2 className="text-2xl font-bold text-white text-center">My Posts</h2>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
               {data?.posts?.length === 0 ? (
                  <div className="text-center py-12">
                     <div className="flex justify-center text-5xl text-gray-400 mb-4">
                        <FaRegSadTear />
                     </div>
                     <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
                     <p className="text-gray-500 mb-6">You haven't created any posts yet</p>
                     <button
                        onClick={() => navigate('/dashboard/add-post')}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-md"
                     >
                        Create a new post
                     </button>
                  </div>
               ) : (
                  <>
                     <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Votes
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Comments
                                 </th>
                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                              {data?.posts?.map((post) => (
                                 <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(post.upVote - post.downVote) >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                          {post.upVote - post.downVote}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <button
                                          onClick={() => navigate(`/dashboard/comments/${post._id}`)}
                                          className="text-indigo-600 hover:text-indigo-900 flex items-center justify-center mx-auto"
                                       >
                                          <FiMessageSquare className="mr-1" /> View
                                       </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <button
                                          onClick={() => handleDelete(post._id)}
                                          className="text-red-600 hover:text-red-900 flex items-center justify-center mx-auto"
                                       >
                                          <FiTrash2 className="mr-1" /> Delete
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     {/* Pagination */}
                     {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                           <div className="flex-1 flex justify-between sm:hidden">
                              <button
                                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                 disabled={page === 1}
                                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                              >
                                 Previous
                              </button>
                              <button
                                 onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                 disabled={page === totalPages}
                                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                              >
                                 Next
                              </button>
                           </div>
                           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                              <div>
                                 <p className="text-sm text-gray-700">
                                    Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span> — Total posts <span className="font-medium">{data?.totalPosts}</span>
                                 </p>
                              </div>
                              <div>
                                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                       onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                       disabled={page === 1}
                                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                       <span className="sr-only">Previous</span>
                                       <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                       let pageNum;
                                       if (totalPages <= 5) {
                                          pageNum = i + 1;
                                       } else if (page <= 3) {
                                          pageNum = i + 1;
                                       } else if (page >= totalPages - 2) {
                                          pageNum = totalPages - 4 + i;
                                       } else {
                                          pageNum = page - 2 + i;
                                       }
                                       return (
                                          <button
                                             key={pageNum}
                                             onClick={() => setPage(pageNum)}
                                             className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pageNum ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                          >
                                             {pageNum}
                                          </button>
                                       );
                                    })}
                                    <button
                                       onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                       disabled={page === totalPages}
                                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                       <span className="sr-only">Next</span>
                                       <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                 </nav>
                              </div>
                           </div>
                        </div>
                     )}
                  </>
               )}
            </div>
         </div>
      </div>
   );
}

export default MyPost;
