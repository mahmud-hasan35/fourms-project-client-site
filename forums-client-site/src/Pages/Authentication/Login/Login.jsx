// import { Link, useLocation, useNavigate } from "react-router";
// import SocialLogin from "../ScialLogin/SocialLogin";
// import UseAuth from "../../../Hook/UseAuth";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// const Login = () => {
//   const { signIn } = UseAuth()
//   const { register, handleSubmit } = useForm()
//   const location = useLocation();
//   const navigate = useNavigate();
//   const from = location.state?.from || '/'


// const onSubmit = data => {
//   signIn(data.email, data.password)
//     .then(result => {
//       console.log(result.user);
//       toast.success("Login successful!");
//       navigate(from);
//     })
//     .catch(error => {
//       console.log(error);
//       toast.error("Invalid email or password");
//     });
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-base-200">
//       <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-base-100 shadow-lg rounded-lg overflow-hidden">

//         {/* Left: Login Form */}
//         <div className="flex items-center justify-center p-10">
//           <div className="w-full max-w-sm">
//             <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <input
//                 type="email"
//                 {...register('email')}
//                 placeholder="Email"
//                 className="input input-bordered w-full"
//                 required
//               />
//               <input
//                 type="password"
//                 {...register('password')}
//                 placeholder="Password"
//                 className="input input-bordered w-full"
//                 required
//               />
//               <button type="submit" className="btn btn-primary w-full">
//                 Login
//               </button>
//               {/* Forgot Password */}
//               <div className="text-right">
//                 <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
//               </div>
//             </form>

//             <SocialLogin></SocialLogin>


//             <p className="text-center mt-4">
//               Don’t have an account?{" "}
//               <Link to="/register" className="text-blue-500 hover:underline">
//                 Register
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Right: Image */}
//         <div className="hidden lg:flex items-center justify-center bg-primary bg-opacity-10">
//           <img
//             src="https://i.ibb.co/gTb7HjT/login.png"
//             alt="Login Illustration"
//             className="max-w-xs"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
