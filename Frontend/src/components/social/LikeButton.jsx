import React, { useState, useEffect } from 'react';
import API from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './LikeButton.css';

function LikeButton({ video }) {
    const { authUser } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isDisliked, setIsDisliked] = useState(false);
    
    const currentUserId = authUser?._id;

    useEffect(() => {
        if (video) {
            // --- THIS IS THE FIX ---
            // Set the initial like count from the video data
            setLikeCount(video.likes?.length || 0); 
            
            // This part correctly sets whether the button should be active
            if (currentUserId) {
                setIsLiked(video.likes?.includes(currentUserId) || false);
                setIsDisliked(video.dislikes?.includes(currentUserId) || false);
            }
        }
    }, [video, currentUserId]);

    const handleToggleLike = async () => {
        if (!currentUserId) return alert("Please log in to like videos!");

        const originalIsLiked = isLiked;
        const originalIsDisliked = isDisliked;
        
        setIsLiked(prev => !prev);
        setLikeCount(prev => (originalIsLiked ? prev - 1 : prev + 1));
        if (originalIsDisliked) setIsDisliked(false);

        try {
            await API.patch(`/likes/toggle/video/${video._id}`);
        } catch (error) {
            console.error("Failed to toggle like:", error);
            // Revert UI on API error
            setIsLiked(originalIsLiked);
            setIsDisliked(originalIsDisliked);
            setLikeCount(prev => (originalIsLiked ? prev + 1 : prev - 1));
        }
    };

    const handleToggleDislike = async () => {
        if (!currentUserId) return alert("Please log in to dislike videos!");

        const originalIsLiked = isLiked;
        const originalIsDisliked = isDisliked;

        setIsDisliked(prev => !prev);
        if (originalIsLiked) {
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
        }
        
        try {
            await API.patch(`/likes/toggle/dislike/${video._id}`);
        } catch (error) {
            console.error("Failed to toggle dislike:", error);
            // Revert UI on API error
            setIsDisliked(originalIsDisliked);
            setIsLiked(originalIsLiked);
            if(originalIsLiked) setLikeCount(prev => prev + 1);
        }
    };

    return (
        <div className='like-dislike-container'>
            <button 
                className={`like-btn ${isLiked ? 'active' : ''}`}
                onClick={handleToggleLike}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
                </svg>
                <span className="count">{likeCount}</span>
            </button>
            <div className="separator-vertical"></div>
            <button 
                className={`dislike-btn ${isDisliked ? 'active' : ''}`}
                onClick={handleToggleDislike}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L8.83 23l6.59-6.59c.37-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
                </svg>
            </button>
        </div>
    );
}

export default LikeButton;