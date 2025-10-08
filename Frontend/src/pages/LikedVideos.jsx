import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import './LikedVideos.css';
import VideoCard from '../components/video/VideoCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function LikedVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();
    
    useEffect(() => {
        // Only fetch videos if the user is logged in
        if (isLoggedIn) {
            const fetchLikedVideos = async () => {
                try {
                    setLoading(true);
                    const response = await API.get('/likes/liked-videos');
                    setVideos(response.data.data); 
                    setError(null);
                } catch (err) {
                    setError("Failed to fetch liked videos. Please try again later.");
                    console.error("API call failed:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchLikedVideos();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);

    // --- Render logic based on state ---
    if (loading) {
        return <div className='status-message'>Loading your liked videos...</div>;
    }

    if (!isLoggedIn) {
        return <div className='status-message'>Please log in to see your liked videos.</div>;
    }

    if (error) {
        return <div className='status-message error'>{error}</div>;
    }

    return (
        <div className='liked-videos-page'>
            <h1 className='liked-videos-header'>Liked Videos</h1>
            
            {videos.length > 0 ? (
                <div className='video-grid'>
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className='empty-state'>
                    <h2>No liked videos yet</h2>
                    <p>Start liking videos to see them here.</p>
                </div>
            )}
        </div>
    );
}

export default LikedVideos;
