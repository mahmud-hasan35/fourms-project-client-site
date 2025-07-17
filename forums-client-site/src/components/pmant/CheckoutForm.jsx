import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hook/useAxiosSecure";

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
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
         <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">
            Complete Your Payment
         </h2>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border border-gray-300 rounded p-4 bg-gray-50">
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
               className={`w-full py-2 px-4 rounded text-white font-medium transition ${loading || userData?.badges === "gold"
                     ? "bg-gray-400 cursor-not-allowed"
                     : "bg-purple-600 hover:bg-purple-700"
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
