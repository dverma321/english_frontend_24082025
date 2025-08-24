import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './IP.css';

const PixelText = ({ text }) => {
  if (!text) return null; // Prevent errors if text is empty

  return (
    <div className="pixel-text">
      {text.split("").map((char, index) => {
        const x = Math.random() * window.innerWidth - window.innerWidth / 2;
        const y = Math.random() * window.innerHeight - window.innerHeight / 2;

        return (
          <motion.span
            key={index}
            initial={{ x, y, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: index * 0.05 }}
            className="pixel-char"
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
};

const IpAddressLocation = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to update time dynamically
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString(); // Format: "MM/DD/YYYY, HH:MM:SS AM/PM"
      setDateTime(formattedDateTime);
    };

    updateDateTime(); // Update immediately
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchIpAndLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        setIpAddress(data.ip);
        setLocation(`${data.city}, ${data.region}, ${data.country_name}`);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchIpAndLocation();
  }, []);

  if (loading) {
    return <div className="loading-text">Loading...</div>;
  }

  if (error) {
    return <div className="error-text">Error: {error}</div>;
  }

  return (
    <div className="containerBlock">
      <p className="title">Welcome User:</p>
      <PixelText text={ipAddress} />
      <p className="title">Location:</p>
      <PixelText text={location} />
      <p className="title">Date & Time:</p>
      <PixelText text={dateTime} />
    </div>
  );
};

export default IpAddressLocation;
