import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

function VideoCard({ video }) {
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef(null); // Use a ref to hold the timer ID

  if (!video || !video.owner) {
    return null;
  }

  const handleMouseEnter = () => {
    // Start a timer to switch to video after 1 second (1000ms)
    timerRef.current = setTimeout(() => {
      setIsHovering(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    // Clear the timer if the mouse leaves before it finishes
    clearTimeout(timerRef.current);
    // Immediately switch back to the thumbnail
    setIsHovering(false);
  };

  return (
    <Link 
      to={`/video/${video._id}`} 
      className='video-card'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovering ? (
        // If hovering, show the video player
        <video
          className='thumbnail-video'
          src={video.videoFile}
          autoPlay
          muted
          loop
        />
      ) : (
        // Otherwise, show the thumbnail image
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className='thumbnail-img' 
        />
      )}
      
      <div className='video-details'>
        <img 
          src={video.owner.avatar} 
          alt={video.owner.fullName} 
          className='channel-avatar' 
        />
        <div className='video-text'>
          <h3 className='video-title'>{video.title}</h3>
          <p className='channel-name'>{video.owner.username}</p>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;