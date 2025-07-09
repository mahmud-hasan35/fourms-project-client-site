import { useEffect, useState } from "react";

const AnnouncementSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/announcements");
        if (!res.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg flex flex-col justify-center items-center h-32">
        <div className="loading loading-spinner loading-lg text-green-600"></div>
        <span className="mt-4 text-green-600 font-medium">Loading announcements...</span>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto my-8 p-6 bg-red-50 shadow-md rounded-lg text-center text-red-600">
        {error}
      </section>
    );
  }

  if (announcements.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-600">📢 Announcements</h2>
      <ul className="space-y-3">
        {announcements.map((announcement) => (
          <li
            key={announcement._id}
            className="p-4 bg-green-50 border-l-4 border-green-500 rounded shadow-sm"
          >
            <p className="text-gray-700">{announcement.message}</p>
            {announcement.date && (
              <p className="text-sm text-gray-500 mt-1">
                {new Date(announcement.date).toLocaleString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AnnouncementSection;
