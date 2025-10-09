import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import './History.css';
import VideoCard from '../components/video/VideoCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function History() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();
    
    useEffect(() => {
        if (isLoggedIn) {
            const fetchHistory = async () => {
                try {
                    setLoading(true);
                    const response = await API.get('/users/history');
                    setVideos(response.data.data); 
                    setError(null);
                } catch (err) {
                    setError("Failed to fetch watch history. Please try again later.");
                    console.error("API call failed:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);

    // --- Render logic moved inside the function ---
    if (loading) {
        return <div className='status-message'>Loading your watch history...</div>;
    }

    if (!isLoggedIn) {
        return <div className='status-message'>Please log in to see your history.</div>;
    }

    if (error) {
        return <div className='status-message error'>{error}</div>;
    }

    return (
        <div className='history-page'>
            <h1 className='history-header'>Watch History</h1>
            
            {videos.length > 0 ? (
                <div className='video-grid'>
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className='empty-state'>
                    <h2>Your history is empty</h2>
                    <p>Videos you watch will appear here.</p>
                </div>
            )}
        </div>
    );
}

export default History;
