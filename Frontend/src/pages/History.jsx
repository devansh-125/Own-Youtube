import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import './History.css';
import VideoCard from '../components/video/VideoCard.jsx';
import ShortsCard from '../components/video/ShortsCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function History() {
    const [videos, setVideos] = useState([]);
    const [longVideos, setLongVideos] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();
    
    useEffect(() => {
        if (isLoggedIn) {
            const fetchHistory = async () => {
                try {
                    setLoading(true);
                    const response = await API.get('/users/history');
                    const allVideos = response.data.data;
                    setVideos(allVideos);
                    
                    // Separate long videos and shorts
                    const longVids = allVideos.filter(v => !v.isShort);
                    const shortVids = allVideos.filter(v => v.isShort);
                    
                    setLongVideos(longVids);
                    setShorts(shortVids);
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
                <>
                    {/* Long Videos Section */}
                    {longVideos.length > 0 && (
                        <>
                            <h2 className='history-section-title'>Videos</h2>
                            <div className='video-grid'>
                                {longVideos.map((video) => (
                                    <VideoCard key={video._id} video={video} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Shorts Section */}
                    {shorts.length > 0 && (
                        <>
                            <h2 className='history-section-title'>Shorts</h2>
                            <div className='shorts-horizontal-scroll'>
                                {shorts.map((short) => (
                                    <ShortsCard key={short._id} short={short} />
                                ))}
                            </div>
                        </>
                    )}
                </>
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
