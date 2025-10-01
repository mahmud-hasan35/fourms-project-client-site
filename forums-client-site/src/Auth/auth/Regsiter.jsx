

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import useAuth from "../../Hook//useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";


function Regsiter() {
   const { createUser,  updateUser } = import useAuth();
   const [selectedImageURL, setSelectedImageURL] = useState(null);
   const axiosInstance = useAxiosSecure();
   console.log(axiosInstance);
   
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

const onSubmit = async (data) => {
   try {
      const { email, password, name } = data;

      // Step 1: Check image uploaded
      if (!selectedImageURL) {
         toast.error("Please upload a profile image before submitting.");
        
         return;
      }

      // Step 2: Create user with email & password
      const result = await createUser(email, password);
      console.log("✅ User created:", result?.user);

      // Step 3: Update user profile
      const userProfile = {
         displayName: name,
         photoURL: selectedImageURL || "https://i.ibb.co/YXy1D4d/default-profile.png"
      };

      await updateUser(userProfile);
      // Step 4: Send user info to backend
      const userInfo = {
         email,
         role: "user",
         badges: "bronze",
         created_at: new Date().toISOString(),
         last_log_in: new Date().toISOString()
      };

      const response = await axiosInstance.post("/users", userInfo);
      console.log("✅ Server response:", response.data);

      // Step 5: Check insertion status
      if (response.data.insertedId) {
         toast.success("🎉 Registration successful!");
         reset();
         setSelectedImageURL(null);
         navigate("/");
      } else {
         toast.error("User already exists or could not be inserted.");
         console.log("❌ User not inserted. Server response:", response.data);
      }

   } catch (error) {
      console.error("❌ Registration error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || error.message || "Registration failed");
   }
};



   const handleImageUpload = async (e) => {
      const image = e.target.files[0];
      const fromData = new FormData();
      fromData.append("image", image);

      const imgbbUrl = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_upload_key}`;

      try {
         const res = await axios.post(imgbbUrl, fromData);
         const uploadedURL = res.data?.data?.url;
         setSelectedImageURL(uploadedURL);
         toast.success("Image uploaded");
      } catch (error) {
         console.error("Image upload failed:", error.message);
         toast.error("Image upload failed");
      }
   };

   return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen bg-white">
         <div className="w-full max-w-md rounded-2xl p-8">
            <h1 className="text-[28px] font-bold text-center mb-1">Create an Account</h1>
            <h3 className="text-center text-gray-500 mb-6">Register with Profast</h3>

            <div className="flex justify-center mb-4">
               {selectedImageURL && (
                  <img src={selectedImageURL} alt="Profile" className="w-32 h-32 rounded-full object-cover border" />
               )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Profile Image</label>
                  <input
                     type="file"
                     style={{ display: "block" }}
                     accept="image/*"
                     onChange={handleImageUpload}
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
               </div>

               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                  <input
                     type="text"
                     {...register("name", { required: "Name is required" })}
                     placeholder="Your name"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  />
                  {errors.name && (
                     <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
               </div>

               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                     type="email"
                     {...register("email", {
                        required: "Email is required",
                        pattern: {
                           value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                           message: "Enter a valid email address"
                        }
                     })}
                     placeholder="Your email"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  />
                  {errors.email && (
                     <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
               </div>

               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                  <input
                     type="password"
                     {...register("password", {
                        required: "Password is required",
                        minLength: {
                           value: 6,
                           message: "Password must be at least 6 characters"
                        }
                     })}
                     placeholder="Create a password"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  />
                  {errors.password && (
                     <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
               </div>

               <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
               >
                  Register
               </button>

               <p className="text-sm text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                     Login
                  </Link>
               </p>

               <div className="flex items-center justify-center gap-2 text-gray-400">
                  <hr className="w-full border-gray-300" />
                  <span>or</span>
                  <hr className="w-full border-gray-300" />
               </div>

            </form>
         </div>
      </div>
   );
}

export default Regsiter;
