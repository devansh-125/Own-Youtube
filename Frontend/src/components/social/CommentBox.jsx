import React, { useState, useRef } from 'react';
import API from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import useOnClickOutside from '../../hooks/useOnClickOutside.js';
import  {formatTimeAgo } from '../utils/helpers.js';
import './CommentBox.css';
import EmojiInput from '../common/EmojiInput.jsx';

function CommentBox({ comment, onCommentDeleted, onCommentUpdated }) {
    const { authUser, isLoggedIn } = useAuth();
    
    // State for menu and editing
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    

    // State for likes
    const [isLiked, setIsLiked] = useState(comment.isLiked);
    const [localLikeCount, setLocalLikeCount] = useState(comment.likesCount || 0);

    const menuRef = useRef(null);
    useOnClickOutside(menuRef, () => setIsMenuOpen(false));

    const isOwner = isLoggedIn && authUser?._id === comment.owner?._id;

    const handleDelete = async () => {
        
        try {
            await API.delete(`/comments/c/${comment._id}`);
            onCommentDeleted(comment._id);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Failed to delete comment.");
        }
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editText.trim()) return;
        try {
            const response = await API.patch(`/comments/c/${comment._id}`, { content: editText });
            onCommentUpdated(response.data.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update comment:", error);
            alert("Failed to update comment.");
        }
    };
    
    const handleToggleLike = async () => {
        if (!isLoggedIn) {
            return alert("Please log in to like comments!");
        }

        const originalIsLiked = isLiked;
        setLocalLikeCount(prev => (originalIsLiked ? prev - 1 : prev + 1));
        setIsLiked(prev => !prev);

        try {
            await API.patch(`/likes/toggle/comment/${comment._id}`);
        } catch (error) {
            console.error("Failed to toggle comment like:", error);
            setLocalLikeCount(prev => (originalIsLiked ? prev + 1 : prev - 1));
            setIsLiked(originalIsLiked);
        }
    };
    
    if (!comment || !comment.owner) return null;

    return (
        <div className="comment-box">
            <img 
                src={comment.owner.avatar} 
                alt={comment.owner.username} 
                className="comment-user-avatar"
            />
            <div className="comment-body">
                <div className="comment-header">
                    <span className="comment-username">@{comment.owner.username}</span>
                    <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate} className="edit-comment-form">
                        <EmojiInput
                            as="textarea"
                            value={editText}
                            onChange={(text) => setEditText(text)}
                            className="edit-comment-input"
                            autoFocus
                            actions={
                                <div className="comment-form-actions">
                                    <button 
                                        type="button" 
                                        className="comment-cancel-btn"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="comment-submit-btn"
                                        disabled={!editText.trim()}
                                    >
                                        Save
                                    </button>
                                </div>
                            }
                        />
                    </form>
                ) : (
                    <>
                        <p className="comment-text">{comment.content}</p>
                        <div className="comment-actions">
                            <button 
                                className={`like-button ${isLiked ? 'active' : ''}`}
                                onClick={handleToggleLike}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
                                </svg>
                            </button>
                            {localLikeCount > 0 && (
                                <span className="like-count">{localLikeCount}</span>
                            )}
                            <button className="dislike-button">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L8.83 23l6.59-6.59c.37-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>

            {isOwner && (
                <div className="comment-options-container" ref={menuRef}>
                    <button className="options-button" onClick={() => setIsMenuOpen(prev => !prev)}>
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" /></svg>
                    </button>
                    {isMenuOpen && (
                        <div className="options-menu">
                            <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="menu-item">Edit</button>
                            <button onClick={handleDelete} className="menu-item delete">Delete</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentBox;