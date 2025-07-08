import { useState } from "react";

export default function AddAnnouncementForm() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    const announcement = { message };

    try {
      const res = await fetch("http://localhost:5000/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcement),
      });

      if (res.ok) {
        setMessage("");
        setSuccess(true);
      }
    } catch (error) {
      console.error("Failed to post announcement", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Add New Announcement</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows="4"
          placeholder="Write your announcement..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Submit
        </button>

        {success && (
          <p className="text-green-600 font-medium mt-2">✅ Announcement added!</p>
        )}
      </form>
    </div>
  );
}
