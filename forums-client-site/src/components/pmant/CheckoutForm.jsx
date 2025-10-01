import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../Hook/useAxiosSecure";

function CheckoutForm({ price, user, userData }) {
   const axiosSecure = useAxiosSecure();

   const stripe = useStripe();
   const elements = useElements();
   const [loading, setLoading] = useState(false);
   const [clientSecret, setClientSecret] = useState("");
   const [errors, setErrors] = useState(null);

   useEffect(() => {
      if (price > 0) {
         axiosSecure.post("/create-payment-intent", { price })
            .then(res => setClientSecret(res.data.clientSecret))
            .catch(() =>
                toast.error("❌ Failed to initialize payment"));
      }
   }, [price, axiosSecure]);

   // 🟢 Step 2: Submit Card and Confirm Payment



   const handleSubmit = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) return;
      const card = elements.getElement(CardElement);
      if (!card) return;

      setLoading(true);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
         payment_method: {
            card,
         },
      });

      if (error) {
         toast.error(error.message);
         setErrors(error.message);
         setLoading(false);
         return;
      }

      // 🟢 Step 3: If payment is successful → Update user badge
      if (paymentIntent.status === "succeeded") {
         toast.success("🎉 Payment successful! Upgrading membership...");

         try {
            const res = await axiosSecure.patch("/users/upgrade", {
               email: user.email,
               badge: "gold"
            });

            if (res.data.modifiedCount > 0) {
               toast.success("🏅 You are now a Gold Member!");
            } else {
               toast.error("Failed to upgrade membership.");
            }
         } catch (err) {
            console.error("Membership update failed", err);
            toast.error("Something went wrong while upgrading membership.");
         }
      }

      setLoading(false);
   };

   return (
 <div
   className={`max-w-md mx-auto p-6 mt-10 rounded-xl shadow-lg border 
      ${userData?.badges === "gold"
         ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400"
         : "bg-white border-gray-200"
      }`}
>
   <div className="text-center mb-6">
      <h2 className={`text-2xl font-bold 
         ${userData?.badges === "gold" ? "text-yellow-600" : "text-purple-700"}`}>
         {userData?.badges === "gold"
            ? "🌟 You're a Gold Member!"
            : "Complete Your Payment"}
      </h2>

      {userData?.badges === "gold" && (
         <p className="text-sm text-yellow-700 mt-1">
            Enjoy exclusive perks, early access, and premium support!
         </p>
      )}
   </div>

   {!userData?.badges === "gold" && (
      <p className="text-center text-gray-600 mb-3">
         Securely complete your payment and join our premium membership.
      </p>
   )}

   <form onSubmit={handleSubmit} className="space-y-4">
      <div
         className={`rounded p-4 transition-all duration-300
            ${userData?.badges === "gold"
               ? "border-2 border-yellow-300 bg-yellow-50"
               : "border border-gray-300 bg-gray-50"
            }`}
      >
         <CardElement
            options={{
               style: {
                  base: {
                     fontSize: "16px",
                     color: "#424770",
                     "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
               },
            }}
         />
      </div>

      <button
         type="submit"
         disabled={!stripe || loading || userData?.badges === "gold"}
         className={`w-full py-2 px-4 rounded text-white font-semibold transition-all duration-300
            ${loading || userData?.badges === "gold"
               ? "bg-gray-400 cursor-not-allowed"
               : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            }`}
      >
         {loading
            ? "Processing..."
            : userData?.badges === "gold"
               ? "Already a Gold Member"
               : `Pay $${price}`}
      </button>

      {errors && <p className="text-red-500">{errors}</p>}
   </form>
</div>

   );
}

export default CheckoutForm;
