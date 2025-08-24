import React, { useState, useEffect } from "react";
import axios from "axios";

const History = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await axios.get(`${apiUrl}/history/user/downloads`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setDownloads(response.data.downloads);
      } catch (error) {
        console.error("Error fetching downloads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  return (
    <div className="container mx-auto m-5 pt-5">
      <h1 className="text-2xl font-bold text-center mt-16 mb-10">Download History</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : downloads.length === 0 ? (
        <p className="text-center text-gray-500">No downloads found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">App Name</th>
              <th className="border border-gray-300 px-4 py-2">Platform</th>
              <th className="border border-gray-300 px-4 py-2">Version</th>
              <th className="border border-gray-300 px-4 py-2">Download Date</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((download, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{download.appName}</td>
                <td className="border border-gray-300 px-4 py-2">{download.deviceType}</td>
                <td className="border border-gray-300 px-4 py-2">{download.version || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(download.downloadDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
