import React, { useState, useEffect } from 'react';
import { getUpNextSuggestions } from '../../services/api.js'; 
import VideoSuggestionCard from './VideoSuggestionCard.jsx';
import './UpNextVideo.css';

function UpNextVideos({ currentVideoId, channelId }) {
    const [suggestedVideos, setSuggestedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        if (!currentVideoId || !channelId) {
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const response = await getUpNextSuggestions(channelId, currentVideoId);
                // Set the results directly from the server's response
                setSuggestedVideos(response.data?.data || []);

            } catch (error) {
                console.error("Failed to fetch suggested videos:", error);
                setSuggestedVideos([]); // Clear suggestions on error
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
        
    // Re-run this effect whenever the main video or its channel changes
    }, [currentVideoId, channelId]); 

    return (
        <div className="up-next-container">
            <h3 className="up-next-title">Up Next</h3>
            
            {loading ? (
                <p>Loading suggestions...</p>
            ) : (
                suggestedVideos.length > 0 ? (
                    <div className="suggestions-list">
                        {suggestedVideos.map(video => (
                            <VideoSuggestionCard key={video._id} video={video} />
                        ))}
                    </div>
                ) : (
                   
                    <p>No other videos available.</p> 
                )
            )}
        </div>
    );
}

export default UpNextVideos;