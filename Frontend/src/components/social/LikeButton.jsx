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
                <svg viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
                <span className="count">{likeCount}</span>
            </button>
            <div className="separator-vertical"></div>
            <button 
                className={`dislike-btn ${isDisliked ? 'active' : ''}`}
                onClick={handleToggleDislike}
            >
                <svg viewBox="0 0 24 24" fill={isDisliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                    <path d="M17 14V2"></path>
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path>
                </svg>
            </button>
        </div>
    );
}

export default LikeButton;