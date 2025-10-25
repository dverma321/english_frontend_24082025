import React, { useState, useEffect } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const [sentences, setSentences] = useState([]);
  const [visibleSentences, setVisibleSentences] = useState([]);

  useEffect(() => {
    fetchSentences();
  }, []);

  useEffect(() => {
    if (sentences.length > 0) {
      // Initialize with 10 random sentences
      updateVisibleSentences();
      
      // Change sentences every 4 seconds
      const interval = setInterval(() => {
        updateVisibleSentences();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [sentences]);

  const getRandomSentences = (count) => {
    const shuffled = [...sentences].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const updateVisibleSentences = () => {
    const randomSentences = getRandomSentences(10);
    const sentencesWithStyles = randomSentences.map((sentence) => ({
      text: sentence,
      position: {
        top: `${Math.random() * 80 + 10}%`, // 10% to 90%
        left: `${Math.random() * 80 + 10}%`, // 10% to 90%
      },
      size: `${Math.random() * 1.5 + 0.8}rem`, // 0.8rem to 2.3rem
      rotation: `${Math.random() * 20 - 10}deg`, // -10deg to +10deg
      opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5
      delay: Math.random() * 2, // 0 to 2s delay
    }));
    
    setVisibleSentences(sentencesWithStyles);
  };

  const fetchSentences = async () => {
    try {
      const apiUrl = import.meta.env.DEV 
        ? import.meta.env.VITE_LOCAL_API_URL 
        : import.meta.env.VITE_PROD_API_URL;
      
      const res = await fetch(`${apiUrl}/language/all-sentence-data`);
      const data = await res.json();
      
      // Extract sentences from the data structure
      const allSentences = data.flatMap(group => group.sentences);
      
      setSentences(allSentences);
    } catch (error) {
      console.error("Error fetching sentences:", error);
      // Fallback sentences in case API fails
      setSentences([
        "Learning languages opens new worlds",
        "Practice makes perfect",
        "Every expert was once a beginner",
        "Consistency is the key to success",
        "Never stop learning",
        "Small steps lead to big results",
        "Progress, not perfection",
        "Mistakes are proof you're trying",
        "Language is the road map of a culture",
        "The limits of my language are the limits of my world",
        "To have another language is to possess a second soul",
        "Language is the blood of the soul",
        "Learn a new language and get a new soul",
        "Language is the dress of thought",
        "Knowledge of languages is the doorway to wisdom"
      ]);
    }
  };

  if (sentences.length === 0) return null;

  return (
    <div className="animated-background">
      {visibleSentences.map((sentenceData, index) => (
        <div
          key={index}
          className="background-sentence"
          style={{
            top: sentenceData.position.top,
            left: sentenceData.position.left,
            fontSize: sentenceData.size,
            transform: `rotate(${sentenceData.rotation})`,
            opacity: sentenceData.opacity,
            animationDelay: `${sentenceData.delay}s`
          }}
        >
          {sentenceData.text}
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;