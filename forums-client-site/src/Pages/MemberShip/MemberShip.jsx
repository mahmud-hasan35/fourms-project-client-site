// import React, { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from '@stripe/react-stripe-js';
// import { useNavigate } from 'react-router';
// import axios from 'axios';
// import useAuth from '../../Hook//useAuth';

// // Stripe public key
// const stripePromise = loadStripe('pk_test_51ReEO2BTjcPYjzOOdKoENbyIxu6Z7hWAbs7KExvVdsCWifZ9QWcBkHvMW14WgLLhzrdVKcow8BeK603DRgTgs6He00of1jU5gD');

// const CheckoutForm = () => {
//   const { user,updateUserProfile } = useAuth();
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setLoading(true);

//   try {
//     // Step 1: Create paymentIntent from backend
//     const { data } = await axios.post('http://localhost:5000/create-payment-intent', {
//       amount: 1000, // $10 in cents
//     });

//     // Step 2: Confirm card payment
//     const result = await stripe.confirmCardPayment(data.clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement),
//         billing_details: {
//           email: user.email,
//         },
//       },
//     });

//     // Step 3: Handle result
//     if (result.error) {
//       setMessage(`❌ Payment failed: ${result.error.message}`);
//     } else if (result.paymentIntent.status === 'succeeded') {
//       const updatedUser = {
//         ...user,
//         isMember: true,
//         badge: 'Gold',
//       };

//       // Step 4: Update user in database
//       await axios.patch(`http://localhost:5000/users/${user.email}`, updatedUser);
//       updateUserProfile(updatedUser);

//       setMessage('✅ Payment succeeded! You are now a Gold member.');
//       setTimeout(() => navigate('/'), 2000);
//     }
//   } catch (error) {
//     setMessage('❌ Payment failed: ' + error.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
//       <h2 className="text-2xl font-bold mb-4 text-center">Become a Gold Member</h2>
//       <p className="mb-4 text-center">
//         Pay <strong>$10</strong> to unlock unlimited posting access and get a Gold badge 🏅
//       </p>

//       <CardElement
//         options={{
//           style: {
//             base: {
//               fontSize: '16px',
//               color: '#424770',
//               '::placeholder': { color: '#aab7c4' },
//             },
//             invalid: { color: '#9e2146' },
//           },
//         }}
//         className="mb-4 p-2 border rounded"
//       />

//       <button
//         type="submit"
//         disabled={!stripe || loading || user?.isMember}
//         className={`w-full py-2 rounded text-white ${
//           user?.isMember ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
//         }`}
//       >
//         {user?.isMember ? 'Already a Gold Member' : loading ? 'Processing Payment...' : 'Pay & Join Now'}
//       </button>

//       {message && (
//         <p className={`text-center mt-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
//           {message}
//         </p>
//       )}
//     </form>
//   );
// };

// const Membership = () => {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm />
//     </Elements>
//   );
// };

// export default Membership;
