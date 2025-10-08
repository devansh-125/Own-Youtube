import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

// 1. Make sure the prop name is 'onProfilePage' (camelCase)
function VideoCard({ video, onProfilePage = false }) {
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef(null);

  if (!video || !video.owner) {
    return null;
  }

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsHovering(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsHovering(false);
  };

  return (
    // 2. Wrap everything in a container to position the button
    <div className='video-card-container'>
      <Link 
        to={`/video/${video._id}`} 
        className='video-card'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isHovering ? (
          <video className='thumbnail-video' src={video.videoFile} autoPlay muted loop />
        ) : (
          <img src={video.thumbnail} alt={video.title} className='thumbnail-img' />
        )}
        
        <div className='video-details'>
          <img src={video.owner.avatar} alt={video.owner.username} className='channel-avatar' />
          <div className='video-text'>
            <h3 className='video-title'>{video.title}</h3>
            <p className='channel-name'>{video.owner.username}</p>
          </div>
        </div>
      </Link>
      
      {/* 3. The conditional rendering for the Edit button */}
      {onProfilePage && (
        <Link to={`/edit-video/${video._id}`} className="edit-video-btn">
            Edit
        </Link>
      )}
    </div>
  );
}

export default VideoCard;