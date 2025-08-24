import React from 'react'
import loadingImage from '../images/gif/spinner.gif'; 
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
        <img src={loadingImage} alt="Loading..." className='loading-image' />
    </div>
  )
}

export default Loading