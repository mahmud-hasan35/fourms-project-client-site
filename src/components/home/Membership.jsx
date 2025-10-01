

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import useAuth from "../../Hook/UseAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import Loading from "../../Pages/LoadingPage/LoadingPage";
import CheckoutForm from "../pmant/CheckoutForm";
const stripePromise = loadStripe('pk_test_51ReEO2BTjcPYjzOOdKoENbyIxu6Z7hWAbs7KExvVdsCWifZ9QWcBkHvMW14WgLLhzrdVKcow8BeK603DRgTgs6He00of1jU5gD');

function Membership() {
   const { user } = useAuth();
   const axiosSecure = useAxiosSecure();
   const[userData,setUserData]=useState()
   const price = 300;


   useEffect(() => {
         if (user?.email) {
            
            axiosSecure
               .get(`/users/${user?.email}`)
               .then((res) => setUserData(res.data))
               .catch((err) => console.error(err));
   
         }
   }, [user, axiosSecure]);

   

   if (!user) {
      return <Loading />; 
   }

   return (
      <div className="max-w-xl h-screen mx-auto mt-10 p-6 ">
         <div className="bg-white rounded shadow-xl py-5 px-5 ">
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Become a Gold Member</h2>
            <p className="text-center text-gray-600 mb-6">
               Enjoy unlimited posting privileges and earn the <span className="text-yellow-500 font-semibold">{userData?.
                  badges} Badge</span>.
            </p>
            <div className="text-center">
               <Elements stripe={stripePromise}>
                  <CheckoutForm user={user} price={price} userData={userData} />
               </Elements>
            </div>
         </div>
      </div>
   );
}

export default Membership;
