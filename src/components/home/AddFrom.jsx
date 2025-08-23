import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import { Link } from "react-router"; // react-router-dom ঠিক আছে
import { useQueryClient } from "@tanstack/react-query";
import UseAuth from "../../Hook/useAuth";
import useAxiosSecure from "../../Hook/useAxiosSecure";

function AddFrom() {
  const { user } = UseAuth();
  const axiosInstance = useAxiosSecure();  // useAxios hook থেকে axios instance
  const queryClient = useQueryClient();

  const [postCount, setPostCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);

  const randomPrice = Math.floor(Math.random() * (500 - 50 + 1)) + 50;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user?.email) {
      axiosInstance
        .get(`/posts/user/${user.email}`)
        .then((res) => setPostCount(res.data.length))
        .catch(() => toast.error("Failed to load post count"));

      axiosInstance
        .get(`/users/${user.email}`)
        .then((res) => setIsMember(res.data?.isMember || false))
        .catch(() => toast.error("Failed to load user info"));
    }

    axiosInstance
      .get("/tags-all")
      .then((res) => {
        const options = res.data.map((tag) => ({
          value: tag,
          label: tag,
        }));
       
        
        setTagOptions(options);
      })
      .catch(() => toast.error("Failed to load tags"));
  }, [user, axiosInstance]);

  

  const onSubmit = async (data) => {
    setLoading(true);

    const postData = {
      authorImage: user.photoURL || "https://i.ibb.co/QvrLdXVn/banner-img.png",
      author: user.displayName || user.email,
      authorEmail: user.email,
      title: data.title,
      price: randomPrice,
      description: data.description,
      tags: data.tags?.map((t) => t.value) || [],
      votes: 0,
      createdAt: new Date(),
    };

    try {
      const res = await axiosInstance.post("/posts", postData);
      if (res.data.insertedId || res.data.acknowledged) {
        toast.success("✅ Post added successfully!");
        reset();
        setPostCount((prev) => prev + 1);

        queryClient.invalidateQueries({ queryKey: ["posts"] });
      } else {
        toast.error("❌ Failed to add post");
      }
    } catch (err) {
      toast.error("⚠️ Error submitting post");
      console.error(err); // error দেখতে
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className="text-center my-10 text-gray-500">Loading user info...</p>
    );
  }

  if (!isMember && postCount >= 5) {
    return (
      <div className="text-center my-10">
        <p className="text-lg font-semibold text-red-600">
          🛑 You’ve reached the free post limit.
        </p>
        <Link to={"/membership"}>
          <button className="mt-3 bg-purple-600 px-5 py-2 text-white rounded hover:bg-purple-700">
            Become a Member
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded my-8">
      <h2 className="text-xl font-bold mb-4">➕ Add New Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          value={user.displayName || user.email}
          disabled
          className="w-full px-4 py-2 border rounded bg-gray-100"
        />

        <div>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            placeholder="Post Title"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={4}
            placeholder="Write your post..."
            className="w-full px-4 py-2 border rounded"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Select {...field} options={tagOptions} isMulti placeholder="Select Tags" />
          )}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Post"}
        </button>
      </form>
    </div>
  );
}

export default AddFrom;
