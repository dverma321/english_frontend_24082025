import { useEffect, useState } from "react";
import axios from "axios";
import './Gems.css';

const GemCoins = () => {
  const [gems, setGems] = useState(0);

  
  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");

  useEffect(() => {
    const fetchGems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/coins/gems`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGems(response.data.gems);
      } catch (error) {
        console.error("Error fetching gems:", error);
      }
    };

    fetchGems();
  }, []);

  return (
    <div className="Gems_page">
      <h2>💎 Gem Coins</h2>
      <h3>{gems} Gems</h3>
    </div>
  );
};

export default GemCoins;
