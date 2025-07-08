import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../../context/AuthContext";

const Login = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-base-100 shadow-lg rounded-lg overflow-hidden">
        
        {/* Left: Login Form */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </form>

            <div className="divider">OR</div>

            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline w-full flex items-center gap-2"
            >
              <FcGoogle className="text-xl" /> Continue with Google
            </button>

            <p className="text-center mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
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

export default Login;
