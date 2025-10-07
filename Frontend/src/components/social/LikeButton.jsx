import React, { useState, useEffect } from 'react';
import API from '../../services/api.js';
import './LikeButton.css';

function LikeButton({ video }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isDisliked, setIsDisliked] = useState(false);
    
    // This is a placeholder. We'll replace this with a real authentication system later.
    const currentUserId = "68e00b0e4fb3a7b287ac378b";

    useEffect(() => {
        if (video) {
            setLikeCount(video.likes?.length || 0);
            if (currentUserId) {
                setIsLiked(video.likes?.includes(currentUserId) || false);
                setIsDisliked(video.dislikes?.includes(currentUserId) || false);
            }
        }
    }, [video, currentUserId]);

    const handleToggleLike = async () => {
        if (!currentUserId) return alert("Please log in to like videos!");

        // Optimistic UI update
        const originalIsLiked = isLiked;
        const originalIsDisliked = isDisliked;
        
        setIsLiked(prev => !prev);
        setLikeCount(prev => (originalIsLiked ? prev - 1 : prev + 1));
        if (originalIsDisliked) setIsDisliked(false);

        try {
            await API.patch(`/videos/toggle/like/${video._id}`);
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
            // NOTE: This API endpoint doesn't exist on the backend yet.
            await API.patch(`/videos/toggle/dislike/${video._id}`);
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
               {likeCount} 👍 
            </button>
            <button 
                className={`dislike-btn ${isDisliked ? 'active' : ''}`}
                onClick={handleToggleDislike}
            >
                👎 
            </button>
        </div>
    );
}

export default LikeButton;