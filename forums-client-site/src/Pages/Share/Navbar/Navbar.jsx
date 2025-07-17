// import { Link } from "react-router";
// import { FaBell, FaBars } from "react-icons/fa";
// import UseAuth from "../../../Hook/UseAuth";
// import { useEffect, useState } from "react";

// const Navbar = () => {
//   const {user, logOut} = UseAuth()
//   const [count, setCount] = useState(0);

//   const handleLogout = () => {
//     logOut()
//     .then(result => {
//       console.log(result);
//     })
//     .catch(error => {
//       console.log(error);
      
//     })
//   };

//   const navItems = (
//     <>
//       <li><Link to="/">Home</Link></li>
//       <li><Link to="/member-ship">Membership</Link></li>
//       <li><Link to="/allPost">AllPost</Link></li>
//     </>
//   );

//   useEffect(() => {
//     const fetchCount = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/announcements/count");
//         const data = await res.json();
//         setCount(data.count);
//       } catch (err) {
//         console.error("Error fetching announcement count", err);
//       }
//     };

//     fetchCount();
//   }, []);

//   return (
//     <div className="navbar bg-base-100 shadow-sm px-4">
//       {/* Mobile Menu Start */}
//       <div className="navbar-start">
//         <div className="dropdown">
//           <label tabIndex={0} className="btn btn-ghost lg:hidden">
//             <FaBars className="text-xl" />
//           </label>
//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
//           >
//             {navItems}
//           </ul>
//         </div>
//         <Link to="/" className="text-xl font-bold">
//           <span className="text-primary">🗣️ Forum</span>Zone
//         </Link>
//       </div>

//       {/* Desktop Menu */}
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal px-1 gap-2">{navItems}</ul>
//       </div>

//       {/* Right Side Icons */}
//       <div className="navbar-end space-x-6 relative">
//         <Link to={'/announcements'}>
//         <div className="relative">
//           <FaBell className="text-xl" />
//           {count > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
//               {count}
//             </span>
//           )}
//         </div>

//         </Link>

//         {!user ? (
//           <Link to="/login" className="btn btn-outline btn-sm">
//             Join Us
//           </Link>
//         ) : (
//           <div className="dropdown dropdown-end">
//             <div tabIndex={0} className="avatar online">
//               <div className="w-10 rounded-full cursor-pointer">
//                 <img
//                   src={
//                     user.photoURL ||
//                     "https://i.ibb.co/ZYW3VTp/default-user.png"
//                   }
//                 />
//               </div>
//             </div>

//             <ul
//               tabIndex={0}
//               className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-48"
//             >
//               <li className="font-semibold text-center">
//                 {user.displayName || "Anonymous"}
//               </li>
//               <li>
//                 <Link to="/dashboard">Dashboard</Link>
//               </li>
//               <li>
//                 <button onClick={handleLogout}>Logout</button>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;
