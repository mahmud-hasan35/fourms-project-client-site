import { useEffect, useState } from "react";

const AnnouncementSection = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("http://localhost:5000/announcements");
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };

    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null; // 👈 Section won't be visible if no announcements

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
