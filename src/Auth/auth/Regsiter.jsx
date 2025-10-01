import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // 👁️ import icons
import useAuth from "../../Hook/UseAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";

function Register() {
  const { createUser, updateUser } = useAuth();
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // 👁️ state
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const { email, password, name } = data;

      if (!selectedImageURL) {
        toast.error("Please upload a profile image before submitting.");
        return;
      }

      const result = await createUser(email, password);
      console.log("✅ User created:", result?.user);

      const userProfile = {
        displayName: name,
        photoURL:
          selectedImageURL || "https://i.ibb.co/YXy1D4d/default-profile.png",
      };

      await updateUser(userProfile);

      const userInfo = {
        email,
        role: "user",
        badges: "bronze",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      const response = await axiosInstance.post("/users", userInfo);

      if (response.data.insertedId) {
        toast.success("🎉 Registration successful!");
        reset();
        setSelectedImageURL(null);
        navigate("/");
      } else {
        toast.error("User already exists or could not be inserted.");
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      toast.error(
        error?.response?.data?.message || error.message || "Registration failed"
      );
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const imgbbUrl = `https://api.imgbb.com/1/upload?expiration=600&key=${
      import.meta.env.VITE_image_upload_key
    }`;

    try {
      const res = await axios.post(imgbbUrl, formData);
      const uploadedURL = res.data?.data?.url;
      setSelectedImageURL(uploadedURL);
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Image upload failed:", error.message);
      toast.error("Image upload failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md rounded-2xl p-8 shadow-xl bg-white">
        <h1 className="text-[28px] font-bold text-center mb-1 text-gray-800">
          Create an Account
        </h1>
        <h3 className="text-center text-gray-500 mb-6">
          Join <span className="font-semibold text-green-600">Forum Verse</span>
        </h3>

        <div className="flex justify-center mb-4">
          {selectedImageURL ? (
            <img
              src={selectedImageURL}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-green-500 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              Upload
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 font-medium shadow-md"
          >
            Register
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
