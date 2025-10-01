import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../Hook/useAxiosSecure';
import useAuth from '../../Hook/useAuth';

function MakeAnnouncement() {
   const axiosSecure = useAxiosSecure();
   const { user } = useAuth(); 

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting }
   } = useForm();

   const onSubmit = async (data) => {
      const announcementData = {
         ...data,
         authorImage: user?.photoURL || '',   
         authorName: user?.displayName || '', 
         authorEmail: user?.email || '',     
         createdAt: new Date()
      };

      try {
         const res = await axiosSecure.post('/announcements', announcementData);
         toast.success(res.data.message || 'Announcement added successfully');
         reset();
      } catch (error) {
         toast.error(error.response?.data?.message || 'Error occurred while posting announcement');
      }
   };

   return (
      <div className="max-w-xl mx-auto p-4">
         <h2 className="text-2xl font-semibold mb-6">Make Announcement</h2>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
               <label className="block mb-1 font-medium">Title</label>
               <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Enter the announcement title"
                  className="w-full p-2 border border-gray-300 rounded"
               />
               {errors.title && <p className="text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
               <label className="block mb-1 font-medium">Description</label>
               <textarea
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Write the announcement details"
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={5}
               ></textarea>
               {errors.description && <p className="text-red-600 mt-1">{errors.description.message}</p>}
            </div>

            <button
               type="submit"
               disabled={isSubmitting}
               className={`w-full py-2 text-white rounded ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
               }`}
            >
               {isSubmitting ? 'Submitting...' : 'Post Announcement'}
            </button>
         </form>
      </div>
   );
}

export default MakeAnnouncement;
