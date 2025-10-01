import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuth from "../../Hook/useAuth";

function Login() {
   const { googleLogin, signIn, resetPassword } = useAuth();
   const [email, setEmail] = useState("");

   const navigate = useNavigate();
   const axiosInstance = useAxiosSecure();

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm();

   // Watch email input to update email state
   const watchedEmail = watch("email");
   React.useEffect(() => {
      setEmail(watchedEmail || "");
   }, [watchedEmail]);

   // Email/Password Login
   const onSubmit = async (data) => {
      try {
         const result = await signIn(data.email, data.password);
         console.log(result.user);

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

   // Forgot password handler
   const handleReset = async (e) => {
      e.preventDefault();
      if (!email) return toast.error("Please enter your email");

      try {
         await resetPassword(email);
         toast.success("Password reset email sent!");
         // optionally clear email input: setEmail("");
      } catch (error) {
         console.error(error);
         toast.error(error.message);
      }
   };

   return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center  relative">
         <div className="w-full max-w-md rounded-2xl p-8 shadow-lg">


            <h3 className="text-[32px] font-bold text-center mb-2">Welcome Back</h3>
            <p className="text-center text-gray-500 mb-6">Login with Forum Verse</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               {/* Email */}
               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                     Email
                  </label>
                  <input
                     type="email"
                     {...register("email", { required: "Email is required" })}
                     placeholder="Enter your email"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  />
                  {errors.email && (
                     <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
               </div>

               {/* Password */}
               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                     Password
                  </label>
                  <input
                     type="password"
                     {...register("password", {
                        required: "Password is required",
                        minLength: {
                           value: 6,
                           message: "Password must be at least 6 characters",
                        },
                     })}
                     placeholder="Enter your password"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  />
                  {errors.password && (
                     <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
               </div>

               {/* Login Button */}
               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
               >
                  Login
               </button>

               {/* Forgot Password */}
               <div className="text-right mt-2">
                  {/* Changed <a> to button for preventing default and handling click */}
                  <button
                     onClick={handleReset}
                     className="text-sm text-blue-600 hover:underline"
                     type="button"
                  >
                     Forgot Password?
                  </button>
               </div>

               {/* Divider */}
               <div className="flex items-center justify-center gap-2 text-gray-400 my-4">
                  <hr className="w-full border-gray-300" />
                  <span>or</span>
                  <hr className="w-full border-gray-300" />
               </div>

               {/* Register Link */}
               <p className="text-sm text-center">
                  Don’t have any account?{" "}
                  <Link to="/register" className="text-blue-600 hover:underline">
                     Register
                  </Link>
               </p>

               {/* Google Login */}
               <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 mt-4"
               >
                  {/* Google icon SVG */}
                  <svg
                     className="w-5 h-5"
                     viewBox="0 0 533.5 544.3"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.3H272v95.3h146.9c-6.3 33.9-25.1 62.5-53.5 81.7v67h86.4c50.5-46.6 81.7-115.3 81.7-193.7z"
                        fill="#4285f4"
                     />
                     <path
                        d="M272 544.3c72.6 0 133.5-24.1 178-65.3l-86.4-67c-23.9 16-54.3 25.3-91.6 25.3-70.4 0-130.1-47.6-151.4-111.3H32.1v69.9C76.8 485.1 168.8 544.3 272 544.3z"
                        fill="#34a853"
                     />
                     <path
                        d="M120.6 326c-10-29.3-10-60.7 0-90l-88.5-69.1C4.6 216.4-4.8 246.6 0.1 278.4c4.9 31.8 19.7 61.3 43.3 85.3l77.2-60.9z"
                        fill="#fbbc04"
                     />
                     <path
                        d="M272 107.7c39.5-.6 77.4 13.6 106.6 39.8l79.8-78.5C408.2 24.6 341.3-.2 272 0 168.8 0 76.8 59.2 32.1 149.5l88.5 69.1C141.9 155.3 201.6 107.7 272 107.7z"
                        fill="#ea4335"
                     />
                  </svg>
                  <span>Continue with Google</span>
               </button>
            </form>
         </div>
      </div>
   );
}

export default Login;
