import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import useAuth from '../../../Hook/UseAuth'
import { useLocation, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import toast from 'react-hot-toast';

export default function SocialLogin() {

    const { googleLogin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/'
    const axiosInstance = useAxiosSecure();


    const handleGoogledSignIn = () => {
        googleLogin()
            .then(async (result) => {
                const user = result.user;
                console.log(result.user);
                // update  userinfo in the database 
                const userInfo = {
                    email: user.email,
                    role: 'user',
                    badges: "bronze",
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()

                }
                const res = await axiosInstance.post('/users', userInfo);
                toast.success("Google login successful!");
                console.log('user info', res.data);
                navigate(from)

            })
            .catch(error => {
                console.error("Google login failed:", error.message);
                toast.error("Google login failed");

            })
    }
    return (
        <div>
            <div className="divider">OR</div>

            <button onClick={handleGoogledSignIn}

                className="btn btn-outline w-full flex items-center gap-2"
            >
                <FcGoogle className="text-xl" /> Continue with Google
            </button>
        </div>
    )
}
