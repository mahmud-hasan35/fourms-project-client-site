import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuth from "../../Hook/UseAuth";
import { Eye, EyeOff } from "lucide-react"; // for show/hide password icon

function Login() {
   const { googleLogin, signIn, resetPassword } = useAuth();
   const [email, setEmail] = useState("");
   const [showPassword, setShowPassword] = useState(false); // 👈 state for password toggle

   const navigate = useNavigate();
   const axiosInstance = useAxiosSecure();

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm();

   // Watch email input
   const watchedEmail = watch("email");
   React.useEffect(() => {
      setEmail(watchedEmail || "");
   }, [watchedEmail]);

   // Email/Password Login
   const onSubmit = async (data) => {
      try {
         const result = await signIn(data.email, data.password);
         toast.success(`Welcome back, ${result.user.displayName || "User"}!`);
         navigate("/");
      } catch (error) {
         toast.error("Login failed! Please check your credentials.");
         console.error(error);
      }
   };

   const handleGoogleLogin = async () => {
      try {
         const result = await googleLogin();
         const user = result.user;

         const userInfo = {
            email: user.email,
            role: "user",
            badges: "bronze",
            created_at: new Date().toISOString(),
            last_log_in: new Date().toISOString(),
         };
         await axiosInstance.post("/users", userInfo);
         toast.success("Google login successful!");
         navigate("/");
      } catch (error) {
         console.error("Google login failed:", error.message);
         toast.error("Google login failed");
      }
   };

   const handleReset = async (e) => {
      e.preventDefault();
      if (!email) return toast.error("Please enter your email");
      try {
         await resetPassword(email);
         toast.success("Password reset email sent!");
      } catch (error) {
         toast.error(error.message);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 px-4">
         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-3xl font-bold text-center mb-2 text-gray-800">
               Welcome Back
            </h3>
            <p className="text-center text-gray-500 mb-6">
               Login with <span className="font-semibold text-blue-600">Forum Verse</span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
               {/* Email */}
               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                     Email
                  </label>
                  <input
                     type="email"
                     {...register("email", { required: "Email is required" })}
                     placeholder="Enter your email"
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                     <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
               </div>

               {/* Password */}
               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                     Password
                  </label>
                  <div className="relative">
                     <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                           required: "Password is required",
                           minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                           },
                        })}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                     >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                     </button>
                  </div>
                  {errors.password && (
                     <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
               </div>

               {/* Forgot Password */}
               <div className="text-right">
                  <button
                     onClick={handleReset}
                     className="text-sm text-blue-600 hover:underline"
                     type="button"
                  >
                     Forgot Password?
                  </button>
               </div>

               {/* Login Button */}
               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md"
               >
                  Login
               </button>

               {/* Divider */}
               <div className="flex items-center justify-center gap-2 text-gray-400 my-4">
                  <hr className="w-full border-gray-300" />
                  <span>or</span>
                  <hr className="w-full border-gray-300" />
               </div>

               {/* Google Login */}
               <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition duration-200"
               >
                  <img
                     src="https://www.svgrepo.com/show/355037/google.svg"
                     alt="Google"
                     className="w-5 h-5"
                  />
                  <span className="font-medium">Continue with Google</span>
               </button>

               {/* Register Link */}
               <p className="text-sm text-center mt-4 text-gray-600">
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-blue-600 font-medium hover:underline">
                     Register
                  </Link>
               </p>
            </form>
         </div>
      </div>
   );
}

export default Login;
