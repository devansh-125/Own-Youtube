import React, { useState, useEffect } from 'react';
import API from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import CommentBox from './CommentBox.jsx';
import EmojiInput from '../common/EmojiInput.jsx';
import './CommentList.css';

function CommentList({ videoId }) {
    const { isLoggedIn, authUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/comments/${videoId}`);
            // Make sure to handle cases where docs might not exist
            setComments(response.data?.data?.docs || []); 
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (videoId) {
            fetchComments();
        }
    }, [videoId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await API.post(`/comments/${videoId}`, { content: newComment });
            setNewComment("");
            fetchComments();
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment. Please try again.");
        }
    };

    // --- THIS IS THE FIX ---
    // We create an explicit handler function to update the state.
    // This makes the data flow clear and prevents state update issues.
    const handleCommentChange = (text) => {
        setNewComment(text);
    };
    // -----------------------

    return (
        <div className="comment-section">
            <h2 className="comment-count">{comments.length} Comments</h2>
            
            {isLoggedIn && (
                <form onSubmit={handleCommentSubmit} className="add-comment-form">
                    <img src={authUser?.avatar} alt="Your avatar" className="comment-avatar" />
                    
                    <EmojiInput
                        as="textarea"
                        value={newComment}
                        onChange={handleCommentChange} // Pass the new handler function
                        placeholder="Add a comment..."
                        theme="dark"
                    />
                    
                    <button 
                        type="submit" 
                        className="comment-submit-btn"
                        disabled={!newComment.trim()}
                    >
                        Comment
                    </button>
                </form>
            )}

            <div className="comment-list">
                {loading ? (
                    <p>Loading comments...</p>
                ) : (
                    comments.map(comment => (
                        <CommentBox key={comment._id} comment={comment} />
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentList;

