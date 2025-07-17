import { Link, useLocation, useNavigate, } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import UseAuth from "../../../Hook/UseAuth";
import SocialLogin from "../ScialLogin/SocialLogin";
import axios from "axios";
import { useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import toast from "react-hot-toast";

const Register = () => {

  const { register, handleSubmit, reset, formState: { errors }, } = useForm()
  const { createUser, updateUserProfile } = UseAuth()
  const [profilePic, setProfilePic] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/'
  const axiosInstance = useAxiosSecure();



  const onSubmit = data => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);
        // update  userinfo in the database 
        const userInfo = {
          email: data.email,
          role: 'user',
          badges: 'bronze',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString()

        }

        const res = await axiosInstance.post('/users', userInfo);
        if (res.data.inserted === false) {
          toast("User already exists.");
        } else {
          toast.success("Registration successful!");
          reset();
          navigate(from);
        }


        // update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic
        }
        updateUserProfile(userProfile)
          .then(() => {
            console.log('profile name pic updated');
          })
          .catch(error => {
            console.log(error);
          })

      })
      .catch(error => {
        console.log(error);

      })

  }


  const handleImageUpload = async (e) => {
    const image = e.target.files[0]
    console.log(image);

    const formData = new FormData();
    formData.append('image', image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?
  key=${import.meta.env.VITE_image_upload_key}`

    const res = await axios.post(imageUploadUrl, formData)
    setProfilePic(res.data.data.url);


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
                {...register('name', { required: true })}
                placeholder="Your Name"
                className="input input-bordered w-full"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">Name is required</span>
              )}
              {/* image */}

              <input
                type="file"
                onChange={handleImageUpload}

                placeholder="Your Profile picture"
                className="input input-bordered w-full"
              />

              <input
                type="email"
                {...register('email', { required: true })}
                placeholder="Email"
                className="input input-bordered w-full"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Email is required</span>
              )}
              <input
                type="password"
                {...register('password', { required: true, minLength: 6 })}
                placeholder="Password"
                className="input input-bordered w-full"
                
              />
              {errors.password && (
                <span className="text-red-500 text-sm">Password must be at least 6 characters</span>
              )}
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
