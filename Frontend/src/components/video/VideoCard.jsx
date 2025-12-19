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
        
        <Link 
            to={video.isShort ? `/shorts` : `/video/${video._id}`} 
            className={`video-card ${video.isShort ? 'is-short' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className='thumbnail-wrapper'>
                {isHovering ? (
                    <video className='thumbnail-video' src={video.videoFile} autoPlay muted loop playsInline />
                ) : (
                    <img src={video.thumbnail} alt={video.title} className='thumbnail-img' />
                )}
                {video.isShort && (
                    <div className="shorts-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M17.77,10.32l-1.2-.5L18,8.06a3.74,3.74,0,0,0-3.5-5.5,3.7,3.7,0,0,0-1.63.38L6,6.37a3.7,3.7,0,0,0-2.14,3.34,3.73,3.73,0,0,0,2.54,3.54l1.2.5L6,15.44a3.74,3.74,0,0,0,3.5,5.5,3.7,3.7,0,0,0,1.63-.38l6.87-3.43a3.7,3.7,0,0,0,2.14-3.34A3.73,3.73,0,0,0,17.77,10.32ZM10,14.5v-5l4.5,2.5Z"></path>
                        </svg>
                        <span>Shorts</span>
                    </div>
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
                                <button onClick={handleEdit}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '12px'}}><path d="M3,17.25V21h3.75L17.81,9.94l-3.75-3.75L3,17.25z M20.71,7.04c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34c-0.39-0.39-1.02-0.39-1.41,0 l-1.83,1.83l3.75,3.75L20.71,7.04z"/></svg>
                                    Edit
                                </button>
                                <button onClick={handleDelete} className="delete-option">
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '12px'}}><path d="M6,19c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7H6V19z M19,4h-3.5l-1-1h-5l-1,1H5v2h14V4z"/></svg>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default VideoCard;

