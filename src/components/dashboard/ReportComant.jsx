import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

const ReportComant = () => {
   const axiosSecure = useAxiosSecure();
   const queryClient = useQueryClient();

   const [modalOpen, setModalOpen] = useState(false);
   const [modalContent, setModalContent] = useState("");

   const [page, setPage] = useState(1);
   const limit = 10;

   const {
      data,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["reported-comments", page],
      queryFn: async () => {
         const res = await axiosSecure.get(`/reported-comments?page=${page}&limit=${limit}`);
         return res.data;
      },
      keepPreviousData: true,
   });

   const reports = data?.reports || [];
   const total = data?.total || 0;
   const totalPages = Math.ceil(total / limit);

   const mutation = useMutation({
      mutationFn: async ({ reportId, actionType, commentId }) => {
         if (actionType === "delete") {
            await axiosSecure.delete(`/comments/${commentId}`);
         } else if (actionType === "ban") {
            await axiosSecure.post(`/ban-user-by-comment/${commentId}`);
         }
         await axiosSecure.delete(`/reported-comments/${reportId}`);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["reported-comments"] });
         Swal.fire("Success", "Action completed successfully", "success");
      },
      onError: () => {
         Swal.fire("Error", "Failed to perform the action", "error");
      },
   });

   const handleAction = (reportId, actionType, commentId) => {
      mutation.mutate({ reportId, actionType, commentId });
   };

   const openModal = (commentText) => {
      setModalContent(commentText);
      setModalOpen(true);
   };

   const closeModal = () => {
      setModalOpen(false);
      setModalContent("");
   };

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [page]);

   if (isLoading)
      return (
         <div className="flex flex-col items-center justify-center mt-16">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-lg font-medium">
               Loading comments...
            </p>
         </div>
      );

   if (isError)
      return (
         <p className="text-center text-red-500 mt-10 text-lg font-medium">
            Something went wrong. Please try again later.
         </p>
      );

   return (
      <div className="p-4 max-w-7xl mx-auto">
         <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            📋 Reported Comments
         </h2>

         {reports?.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-10">
               No reports found.
            </p>
         ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
               <table className="min-w-full table-auto border-collapse">
                  <thead className="bg-gray-100 sticky top-0">
                     <tr>
                        <th className="border-b px-4 py-3 text-left text-gray-700 font-semibold">
                           User
                        </th>
                        <th className="border-b px-4 py-3 text-left text-gray-700 font-semibold">
                           Email
                        </th>
                        <th className="border-b px-4 py-3 text-left text-gray-700 font-semibold">
                           Comment
                        </th>
                        <th className="border-b px-4 py-3 text-left text-gray-700 font-semibold">
                           Feedback
                        </th>
                        <th className="border-b px-4 py-3 text-center text-gray-700 font-semibold">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {reports?.map((r) => (
                        <tr key={r._id} className="hover:bg-gray-50 even:bg-white odd:bg-gray-50">
                           <td className="border-b px-4 py-3 text-gray-800 max-w-[120px] truncate">
                              {r.userName}
                           </td>
                           <td className="border-b px-4 py-3 text-gray-700 max-w-[160px] truncate">
                              {r.userEmail}
                           </td>
                           <td className="border-b px-4 py-3 text-gray-800 max-w-[280px]">
                              {r.commentText.length > 40 ? (
                                 <>
                                    <span className="truncate inline-block max-w-[240px] align-middle">
                                       {r.commentText.slice(0, 40)}
                                    </span>
                                    ...
                                    <button
                                       onClick={() => openModal(r.commentText)}
                                       className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                                    >
                                       View More
                                    </button>
                                 </>
                              ) : (
                                 r.commentText
                              )}
                           </td>
                           <td className="border-b px-4 py-3 text-gray-700 max-w-[160px] truncate">
                              {r.feedback}
                           </td>
                           <td className="border-b px-4 py-3 text-center space-x-2 whitespace-nowrap">
                              <button
                                 onClick={() => handleAction(r._id, "ban", r.commentId)}
                                 className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                                 disabled={mutation.isLoading}
                              >
                                 Ban
                              </button>
                              <button
                                 onClick={() => handleAction(r._id, "delete", r.commentId)}
                                 className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs"
                                 disabled={mutation.isLoading}
                              >
                                 Delete
                              </button>
                              <button
                                 onClick={() => handleAction(r._id, "ignore", r.commentId)}
                                 className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-xs"
                                 disabled={mutation.isLoading}
                              >
                                 Ignore
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {/* Pagination */}
         {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
               <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
               >
                  Previous
               </button>
               {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                     <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 rounded ${pageNum === page
                           ? "bg-blue-600 text-white"
                           : "bg-gray-200"
                           }`}
                     >
                        {pageNum}
                     </button>
                  );
               })}
               <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
               >
                  Next
               </button>
            </div>
         )}

         {/* Modal */}
         {modalOpen && (
            <div
               className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
               onClick={closeModal}
            >
               <div
                  className="bg-white rounded-lg max-w-xl w-full p-6 shadow-lg relative"
                  onClick={(e) => e.stopPropagation()}
               >
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                     Full Comment
                  </h3>
                  <p className="mb-6 whitespace-pre-wrap text-gray-700 text-base">
                     {modalContent}
                  </p>
                  <button
                     onClick={closeModal}
                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
                     aria-label="Close modal"
                  >
                     ×
                  </button>
                  <button
                     onClick={closeModal}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
                  >
                     Close
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default ReportComant;
