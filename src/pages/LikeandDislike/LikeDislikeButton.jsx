import { useEffect, useState } from "react";
import useFetchUser from "../API/FetchUserInfo";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const LikeDislike = ({ appId }) => {
  const { state } = useFetchUser();
  const userId = state?.userInfo?._id;
  const [liked, setLiked] = useState(null);
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0 });

  const fetchCounts = async () => {
    try {
      const apiUrl = import.meta.env.DEV
        ? import.meta.env.VITE_LOCAL_API_URL
        : import.meta.env.VITE_PROD_API_URL;
      const res = await axios.get(`${apiUrl}/like-dislike/count/${appId}`);
      setCounts(res.data);
    } catch (err) {
      console.error("Failed to fetch counts", err);
    }
  };

  const handleLikeDislike = async (val) => {
    if (!userId) {
      alert("Please log in to like/dislike.");
      return;
    }

    try {
      const token = localStorage.getItem("jwtoken");
      const apiUrl = import.meta.env.DEV
        ? import.meta.env.VITE_LOCAL_API_URL
        : import.meta.env.VITE_PROD_API_URL;

      await axios.post(
        `${apiUrl}/like-dislike/likeanddislike`,
        {
          appId,
          liked: val,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
              },
            withCredentials: true
        }
      );

      setLiked(val);
      fetchCounts();
    } catch (err) {
      console.error("Failed to like/dislike", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="flex items-center space-x-4 mt-2">
      <button
        onClick={() => handleLikeDislike(true)}
        className={`flex items-center px-3 py-1 rounded ${
          liked === true ? "bg-green-500 text-white" : "bg-gray-200"
        }`}
        disabled={!userId}
      >
        <FaThumbsUp className="mr-1" /> {counts.likes}
      </button>

      {/* Dislike button  */}
      
      {/* <button
        onClick={() => handleLikeDislike(false)}
        className={`flex items-center px-3 py-1 rounded ${
          liked === false ? "bg-red-500 text-white" : "bg-gray-200"
        }`}
        disabled={!userId}
      >
        <FaThumbsDown className="mr-1" /> {counts.dislikes}
      </button> */}
    </div>
  );
};

export default LikeDislike;
