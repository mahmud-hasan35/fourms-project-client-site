


const CommentModal = ({ comment, onClose }) => {
   return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
         <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Full Comment</h3>
            <p className="mb-4">{comment}</p>
            <button
               onClick={onClose}
               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
               Close
            </button>
         </div>
      </div>
   );
};

export default CommentModal;