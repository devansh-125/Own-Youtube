import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import './VideoCard.css';
import { formatTimeAgo } from '../utils/helpers.js';

// --- Helper Functions ---
const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M views';
    if (views >= 1000) return (views / 1000).toFixed(0) + 'K views';
    return views + ' views';
};


function VideoCard({ video, onProfilePage = false }) {
  const [isHovering, setIsHovering] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  if (!video || !video.owner) {
    return null;
  }

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setIsHovering(true), 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsHovering(false);
    setShowMenu(false); // Menu ko bhi hide kar dein jab hover hate
  };

  const handleDeleteVideo = async () => {
      if (!window.confirm("Are you sure you want to delete this video?")) return;
      try {
          await API.delete(`/videos/${video._id}`);
          alert("Video deleted successfully");
          window.location.reload(); 
      } catch (error) {
          alert("Failed to delete video.");
          console.error("Delete error:", error);
      }
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    setShowMenu(prev => !prev);
  };

  return (
    <div 
      className='video-card-container'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/video/${video._id}`} className='video-card'>
        <div className='thumbnail-wrapper'>
          {isHovering ? (
            <video className='thumbnail-video' src={video.videoFile} autoPlay muted loop />
          ) : (
            <img src={video.thumbnail} alt={video.title} className='thumbnail-img' />
          )}
        </div>
        
        <div className='video-details'>
          <img src={video.owner.avatar} alt={video.owner.username} className='channel-avatar' />
          <div className='video-text'>
            <h3 className='video-title'>{video.title}</h3>
            <p className='channel-name'>{video.owner.username}</p>
            <div className='video-meta'>
              <span>{formatViews(video.views)}</span>
              <span>•</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>
          </div>

          {onProfilePage && (
            <div className="video-options">
                <button className="options-btn" onClick={handleMenuClick}>
                    ⋮
                </button>
                {showMenu && (
                    <div className="options-menu">
                        <button onClick={(e) => { e.preventDefault(); navigate(`/edit-video/${video._id}`)}}>Edit</button>
                        <button onClick={(e) => { e.preventDefault(); handleDeleteVideo()}} className="delete-option">Delete</button>
                    </div>
                )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;

