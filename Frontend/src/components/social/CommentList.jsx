import React, { useState, useEffect } from 'react';
import API from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import CommentBox from './CommentBox.jsx';
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
            setComments(response.data.data.docs);
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
            setNewComment(""); // Clear the input box
            fetchComments(); // Refresh the comment list
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment. Please try again.");
        }
    };

    return (
        <div className="comment-section">
            <h2 className="comment-count">{comments.length} Comments</h2>
            
            {isLoggedIn && (
                <form onSubmit={handleCommentSubmit} className="add-comment-form">
                    <img src={authUser?.avatar} alt="Your avatar" className="comment-avatar" />
                    <textarea
                        className="comment-input"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit" className="comment-submit-btn">Comment</button>
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