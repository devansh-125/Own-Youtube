import React, { useState, useEffect } from 'react';
import API from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './CommentBox.css';
import { formatTimeAgo } from '../utils/helpers.js';

function CommentBox({ comment }) {
    const { authUser, isLoggedIn } = useAuth();
    
    // --- NEW STATE FOR LIKES ---
    const [isLiked, setIsLiked] = useState(comment.isLiked);
    const [localLikeCount, setLocalLikeCount] = useState(comment.likesCount || 0);

    const handleToggleLike = async () => {
        if (!isLoggedIn) {
            return alert("Please log in to like comments!");
        }

        // Optimistic UI update
        const originalIsLiked = isLiked;
        setLocalLikeCount(prev => (originalIsLiked ? prev - 1 : prev + 1));
        setIsLiked(prev => !prev);

        try {
            // Call the backend API
            await API.patch(`/likes/toggle/comment/${comment._id}`);
        } catch (error) {
            console.error("Failed to toggle comment like:", error);
            // Revert the UI changes if the API call fails
            setLocalLikeCount(prev => (originalIsLiked ? prev + 1 : prev - 1));
            setIsLiked(originalIsLiked);
        }
    };

    
    if (!comment || !comment.owner) {
        return null; 
    }
    

    return (
        <div className="comment-box">
            <img 
                src={comment.owner.avatar} 
                alt={comment.owner.username} 
                className="comment-avatar"
            />
            <div className="comment-content">
                <div className="comment-header">
                    <span className="comment-username">@{comment.owner.username}</span>
                    <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                </div>
                <p className="comment-text">{comment.content}</p>
                <div className="comment-actions">
                    <button 
                        className={`comment-like-btn ${isLiked ? 'active' : ''}`}
                        onClick={handleToggleLike}
                    >
                        ❤️ {localLikeCount}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommentBox;