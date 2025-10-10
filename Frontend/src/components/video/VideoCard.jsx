import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';
import './VideoCard.css';
import { formatTimeAgo } from '../utils/helpers.js';

// Helper Functions
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
        timerRef.current = setTimeout(() => setIsHovering(true), 600); // Slightly shorter delay
    };

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        setIsHovering(false);
        setShowMenu(false);
    };

    const handleMenuClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(prev => !prev);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/edit-video/${video._id}`);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        // A simple modal is better than window.confirm/alert
        // For now, we keep the logic but close the menu.
        setShowMenu(false);
        try {
            await API.delete(`/videos/${video._id}`);
            // Instead of reloading, it's better to update the parent state
            window.location.reload(); 
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        // The Link is now the main container with the hover effects
        <Link 
            to={`/video/${video._id}`} 
            className='video-card'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className='thumbnail-wrapper'>
                {isHovering ? (
                    <video className='thumbnail-video' src={video.videoFile} autoPlay muted loop playsInline />
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
                    // This container is the key to correct menu positioning
                    <div className="video-options">
                        <button className="options-btn" onClick={handleMenuClick}>
                           <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" /></svg>
                        </button>
                        {showMenu && (
                            <div className="options-menu">
                                <button onClick={handleEdit}>Edit</button>
                                <button onClick={handleDelete} className="delete-option">Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default VideoCard;

