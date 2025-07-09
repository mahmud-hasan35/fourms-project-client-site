import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../../context/AuthContext";
import SocialLogin from "../ScialLogin/SocialLogin";
import UseAuth from "../../../Hook/UseAuth";
import { useForm } from "react-hook-form";

const Login = () => {
  const {signIn} = UseAuth()
  const {register,handleSubmit} = useForm()
  const navigate = useNavigate();

  const onSubmit = data => {
    signIn(data.email, data.password)
    
    .then(result => {
      console.log(result.user);
      
    })
    .catch(error => {
      console.log(error);
      
    })
    
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-base-100 shadow-lg rounded-lg overflow-hidden">
        
        {/* Left: Login Form */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="email"
                {...register('email')}
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />
              <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </form>

            <SocialLogin></SocialLogin>


            <p className="text-center mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Right: Image */}
        <div className="hidden lg:flex items-center justify-center bg-primary bg-opacity-10">
          <img
            src="https://i.ibb.co/gTb7HjT/login.png"
            alt="Login Illustration"
            className="max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
