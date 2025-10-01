
import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FiAlertTriangle, FiChevronDown, FiMessageSquare } from "react-icons/fi";
import { FaRegFlag } from "react-icons/fa";
import CommentModal from "./CommentModal";
import useAxiosSecure from "../Hook/useAxiosSecure";
import Loading from "../../Pages/LoadingPage/LoadingPage";

const feedbackOptions = [
   "Unrelated comment",
   "Offensive language",
   "Spam or promotion",
   "Incorrect information",
   "Harassment"
];

const COMMENTS_PER_PAGE = 10;

const Coomentsuserdas = () => {
   const { postId } = useParams();
   const axiosSecure = useAxiosSecure();
   const [selectedFeedback, setSelectedFeedback] = useState({});
   const [reportedComments, setReportedComments] = useState({});
   const [expandedComments, setExpandedComments] = useState({});
   const [modalComment, setModalComment] = useState(null);
   const [page, setPage] = useState(1);

   const {
      data,
      isLoading,
      error,
   } = useQuery({
      queryKey: ["comments", page],
      queryFn: async () => {
         const res = await axiosSecure.get(`/comments?page=${page}&limit=${COMMENTS_PER_PAGE}`);
         return res.data;
      },
      keepPreviousData: true,
   });

   if (isLoading) {
      return <Loading/>
   }

   const comments = data?.comments || [];
   const total = data?.total || 0;
   const totalPages = Math.ceil(total / COMMENTS_PER_PAGE);
   const postComments = comments.filter(com => com.postId === postId);

   const handleFeedbackChange = (commentId, value) => {
      setSelectedFeedback(prev => ({ ...prev, [commentId]: value }));
   };

   const handleReport = async (commentId) => {
      const feedback = selectedFeedback[commentId];
      if (!feedback) return alert("Please select a feedback before reporting.");

      try {
         await axiosSecure.post(`/report-comment`, { commentId, feedback });
         setReportedComments(prev => ({ ...prev, [commentId]: true }));
      } catch (error) {
         alert("Error reporting the comment. Please try again.");
      }
   };

   const closeModal = () => setModalComment(null);

   return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
         <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                     <FiMessageSquare className="mr-2" /> Comments Management
                  </h2>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                     {postComments.length} comments
                  </span>
               </div>
            </div>

            <div className="p-4 sm:p-6">
               {isLoading ? (
                  <div className="flex justify-center items-center min-h-[200px]">
                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
               ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
                     <div className="flex items-center">
                        <FiAlertTriangle className="text-red-500 text-2xl mr-2" />
                        <p className="text-red-700 font-medium">Error loading comments</p>
                     </div>
                  </div>
               ) : postComments?.length === 0 ? (
                  <div className="text-center py-12">
                     <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <FiMessageSquare className="text-gray-400 text-3xl" />
                     </div>
                     <h3 className="text-lg font-medium text-gray-700 mb-2">No comments found</h3>
                     <p className="text-gray-500">There are no comments for this post yet.</p>
                  </div>
               ) : (
                  <>
                     <div className="space-y-4">
                        {postComments?.map((comment) => {
                           const isReported = reportedComments[comment._id];
                           const commentTooLong = comment.comment.length > 20;

                           return (
                              <div
                                 key={comment._id}
                                 className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                              >
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <p className="font-medium text-gray-800">{comment.userEmail}</p>
                                       <p className="text-sm text-gray-500 mt-1">
                                          {new Date(comment.createdAt).toLocaleString()}
                                       </p>
                                    </div>
                                    {isReported && (
                                       <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                                          <FaRegFlag className="mr-1" /> Reported
                                       </span>
                                    )}
                                 </div>

                                 <div className="mt-3">
                                    <p className="text-gray-700">
                                       {commentTooLong
                                          ? `${comment.comment.slice(0, 20)}...`
                                          : comment.comment}
                                    </p>
                                    {commentTooLong && (
                                       <button
                                          onClick={() => setModalComment(comment.comment)}
                                          className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                                       >
                                          Read More
                                       </button>
                                    )}
                                 </div>

                                 <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                       <div className="flex-1">
                                          <select
                                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                             value={selectedFeedback[comment._id] || ""}
                                             onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
                                             disabled={isReported}
                                          >
                                             <option value="">Select report reason</option>
                                             {feedbackOptions?.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                             ))}
                                          </select>
                                       </div>
                                       <button
                                          onClick={() => handleReport(comment._id)}
                                          disabled={!selectedFeedback[comment._id] || isReported}
                                          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center ${isReported
                                             ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                                             : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                                       >
                                          <FaRegFlag className="mr-2" />
                                          {isReported ? "Report Submitted" : "Report Comment"}
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>

                     {/* Pagination Footer */}
                     {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                           <button
                              disabled={page === 1}
                              onClick={() => setPage((p) => p - 1)}
                              className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
                           >
                              Prev
                           </button>
                           {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                              <button
                                 key={pg}
                                 onClick={() => setPage(pg)}
                                 className={`px-3 py-1 rounded ${pg === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                              >
                                 {pg}
                              </button>
                           ))}
                           <button
                              disabled={page === totalPages}
                              onClick={() => setPage((p) => p + 1)}
                              className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
                           >
                              Next
                           </button>
                        </div>
                     )}
                  </>
               )}
            </div>
         </div>

         {/* Modal */}
         {modalComment && (
            <CommentModal comment={modalComment} onClose={closeModal} />
         )}
      </div>
   );
};

export default Coomentsuserdas;












// 3 number 


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import { FiAlertTriangle, FiMessageSquare } from "react-icons/fi";
// import { FaRegFlag } from "react-icons/fa";
// import CommentModal from "./CommentModal";

// const feedbackOptions = [
//    "Unrelated comment",
//    "Offensive language",
//    "Spam or promotion",
//    "Incorrect information",
//    "Harassment"
// ];

// const Coomentsuserdas = () => {
//    const { postId } = useParams();
//    const axiosSecure = useAxiosSecure();
//    const [comments, setComments] = useState([]);
//    const [selectedFeedback, setSelectedFeedback] = useState({});
//    const [reportedComments, setReportedComments] = useState({});
//    const [expandedComments, setExpandedComments] = useState({});
//    const [isLoading, setIsLoading] = useState(true);
//    const [error, setError] = useState(null);
//    const [modalComment, setModalComment] = useState(null);

//    // Pagination states
//    const [currentPage, setCurrentPage] = useState(1);
//    const commentsPerPage = 10;

//    useEffect(() => {
//       const fetchComments = async () => {
//          try {
//             setIsLoading(true);
//             const res = await axiosSecure.get(`/comments`);
//             setComments(res.data);
//          } catch (err) {
//             setError("Failed to load comments. Please try again later.");
//          } finally {
//             setIsLoading(false);
//          }
//       };
//       fetchComments();
//    }, [axiosSecure]);

//    const postComments = comments.filter((com) => com.postId === postId);

//    const indexOfLastComment = currentPage * commentsPerPage;
//    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
//    const currentComments = postComments.slice(indexOfFirstComment, indexOfLastComment);
//    const totalPages = Math.ceil(postComments.length / commentsPerPage);

//    const handlePageChange = (pageNumber) => {
//       setCurrentPage(pageNumber);
//    };

//    const handleFeedbackChange = (commentId, value) => {
//       setSelectedFeedback((prev) => ({ ...prev, [commentId]: value }));
//    };

//    const handleReport = async (commentId) => {
//       const feedback = selectedFeedback[commentId];
//       if (!feedback) {
//          alert("Please select a feedback before reporting.");
//          return;
//       }
//       try {
//          await axiosSecure.post(`/report-comment`, { commentId, feedback });
//          setReportedComments((prev) => ({ ...prev, [commentId]: true }));
//       } catch (error) {
//          alert("Error reporting the comment. Please try again.");
//       }
//    };

//    const toggleExpandComment = (commentId) => {
//       setExpandedComments((prev) => ({
//          ...prev,
//          [commentId]: !prev[commentId],
//       }));
//    };

//    const closeModal = () => {
//       setModalComment(null);
//    };

//    if (isLoading) {
//       return (
//          <div className="flex justify-center items-center min-h-[200px]">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//          </div>
//       );
//    }

//    if (error) {
//       return (
//          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow max-w-5xl mx-auto my-4">
//             <div className="flex items-center">
//                <FiAlertTriangle className="text-red-500 text-2xl mr-2" />
//                <p className="text-red-700 font-medium">{error}</p>
//             </div>
//          </div>
//       );
//    }

//    return (
//       <div className="max-w-5xl mx-auto p-4 sm:p-6">
//          <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
//                <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-bold text-white flex items-center">
//                      <FiMessageSquare className="mr-2" />
//                      Comments Management
//                   </h2>
//                   <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
//                      {postComments.length} comments
//                   </span>
//                </div>
//             </div>

//             <div className="p-4 sm:p-6">
//                {postComments.length === 0 ? (
//                   <div className="text-center py-12">
//                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//                         <FiMessageSquare className="text-gray-400 text-3xl" />
//                      </div>
//                      <h3 className="text-lg font-medium text-gray-700 mb-2">No comments found</h3>
//                      <p className="text-gray-500">There are no comments for this post yet.</p>
//                   </div>
//                ) : (
//                   <div className="space-y-4">
//                      {currentComments.map((comment) => {
//                         const isReported = reportedComments[comment._id];
//                         const isExpanded = expandedComments[comment._id];
//                         const commentTooLong = comment.comment.length > 20;

//                         return (
//                            <div
//                               key={comment._id}
//                               className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
//                            >
//                               <div className="flex justify-between items-start">
//                                  <div>
//                                     <p className="font-medium text-gray-800">{comment.userEmail}</p>
//                                     <p className="text-sm text-gray-500 mt-1">
//                                        {new Date(comment.createdAt).toLocaleString()}
//                                     </p>
//                                  </div>
//                                  {isReported && (
//                                     <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
//                                        <FaRegFlag className="mr-1" /> Reported
//                                     </span>
//                                  )}
//                               </div>

//                               <div className="mt-3">
//                                  <p className="text-gray-700">
//                                     {commentTooLong && !isExpanded
//                                        ? `${comment.comment.slice(0, 20)}...`
//                                        : comment.comment}
//                                  </p>
//                                  {commentTooLong && !isExpanded && (
//                                     <button
//                                        onClick={() => setModalComment(comment.comment)}
//                                        className="text-blue-600 hover:text-blue-800 text-sm mt-1"
//                                     >
//                                        Read More
//                                     </button>
//                                  )}
//                               </div>

//                               <div className="mt-4 pt-4 border-t border-gray-100">
//                                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                                     <div className="flex-1">
//                                        <select
//                                           className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                                           value={selectedFeedback[comment._id] || ""}
//                                           onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
//                                           disabled={isReported}
//                                        >
//                                           <option value="">Select report reason</option>
//                                           {feedbackOptions.map((option) => (
//                                              <option key={option} value={option}>
//                                                 {option}
//                                              </option>
//                                           ))}
//                                        </select>
//                                     </div>
//                                     <button
//                                        onClick={() => handleReport(comment._id)}
//                                        disabled={!selectedFeedback[comment._id] || isReported}
//                                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center ${isReported
//                                              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
//                                              : "bg-red-100 text-red-700 hover:bg-red-200"
//                                           }`}
//                                     >
//                                        <FaRegFlag className="mr-2" />
//                                        {isReported ? "Report Submitted" : "Report Comment"}
//                                     </button>
//                                  </div>
//                               </div>
//                            </div>
//                         );
//                      })}
//                   </div>
//                )}

//                {/* Pagination Footer */}
//                {totalPages > 1 && (
//                   <div className="mt-6 flex justify-center">
//                      <nav className="inline-flex space-x-1">
//                         {[...Array(totalPages)].map((_, index) => {
//                            const pageNumber = index + 1;
//                            return (
//                               <button
//                                  key={pageNumber}
//                                  onClick={() => handlePageChange(pageNumber)}
//                                  className={`px-3 py-1 rounded-md text-sm font-medium border ${currentPage === pageNumber
//                                        ? "bg-blue-600 text-white border-blue-600"
//                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                                     }`}
//                               >
//                                  {pageNumber}
//                               </button>
//                            );
//                         })}
//                      </nav>
//                   </div>
//                )}
//             </div>
//          </div>

//          {/* Modal */}
//          {modalComment && <CommentModal comment={modalComment} onClose={closeModal} />}
//       </div>
//    );
// };

// export default Coomentsuserdas;
