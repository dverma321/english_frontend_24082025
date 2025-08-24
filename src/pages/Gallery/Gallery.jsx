import React, { useEffect, useState } from 'react';
import './Gallery.css';
import { images } from './ImageArray';

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const Gallery = () => {
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    // Shuffle images on component mount
    const shuffled = shuffleArray(images);
    setShuffledImages(shuffled);
  }, []);

  return (
    <div className="gallery">
      {shuffledImages.map((image, index) => (
        <div key={index} className="gallery-item">
          <img src={image} alt={`Gallery item ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;