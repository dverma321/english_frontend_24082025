import React from "react";
import { motion } from "framer-motion";

const PixelText = ({ text }) => {
  // Split text by new lines ("\n")
  const lines = text.split("\n");

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "3rem",
      fontWeight: "bold",
      textAlign: "center",
    }}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} style={{ display: "flex", marginBottom: "10px" }}>
          {line.split("").map((char, charIndex) => {
            // Generate random initial positions for each character
            const x = Math.random() * window.innerWidth - window.innerWidth / 2;
            const y = Math.random() * window.innerHeight - window.innerHeight / 2;

            return (
              <motion.span
                key={charIndex}
                initial={{ x, y, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: (lineIndex * 0.5) + (charIndex * 0.1) }}
                style={{
                  display: "inline-block",
                  color: "black",
                  marginRight: "5px",
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return <PixelText text={"Welcome\nDivyanshu"} />;
}
