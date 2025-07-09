import { Link, } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import UseAuth from "../../../Hook/UseAuth";
import SocialLogin from "../ScialLogin/SocialLogin";

const Register = () => {

const {register,handleSubmit,formState:{errors},} = useForm()
const {createUser} = UseAuth()

const onSubmit = data => {
  console.log(data);
  createUser(data.email, data.password)
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
            <h2 className="text-3xl font-bold text-center mb-6">Register Now!</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                {...register('name', {required: true})}
                placeholder="Your Name"
                className="input input-bordered w-full"
              />
               {errors.required && (
                  <span className="text-red-500 text-sm">Name is required</span>
                )}
              <input
                type="email"
                {...register('email', {required: true})}
                placeholder="Email"
                className="input input-bordered w-full"
              />
               {errors.required && (
                  <span className="text-red-500 text-sm">Email is required</span>
                )}
              <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </form>

         <SocialLogin></SocialLogin>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
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

export default Register;
