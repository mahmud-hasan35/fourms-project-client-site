import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import UseAuth from '../../../Hook/UseAuth'

export default function SocialLogin() {

     const {googleLogin} = UseAuth();

     const handleGoogledSignIn = () => {
        googleLogin()
        .then(result => {
            console.log(result.user);
            
        })
        .catch(error => {
            console.log(error);
            
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
