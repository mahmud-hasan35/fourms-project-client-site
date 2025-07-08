// src/components/Navbar.jsx
import { Link, NavLink } from "react-router";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  // Simulate logged in or not
  const isLoggedIn = false;

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Left: Logo */}
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-primary">Forum</span>Zone
        </Link>
      </div>

      {/* Center: Nav Links */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-3 font-medium">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/membership">Membership</NavLink></li>
        </ul>
      </div>

      {/* Right: Notification + Profile/Join Button */}
      <div className="navbar-end gap-3">
        {/* Notification icon */}
        <FiBell className="text-xl cursor-pointer" />

        {/* Conditional rendering for login state */}
        {!isLoggedIn ? (
          <Link to="/login" className="btn btn-sm btn-primary">
            Join Us
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src="https://i.ibb.co/4pDNDk1/user.png"
                  alt="User Avatar"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <span className="font-semibold text-center">John Doe</span>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
