import React from 'react';
import { Link } from 'react-router-dom';
import './VideoSuggestionCard.css'; 

function VideoSuggestionCard({ video }) {
    if (!video || !video.owner) {
        return null; 
    }
    const formatDuration = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(14, 5); // Formats to MM:SS
    };
    
    // Function to format views (e.g., 1K, 1M)
    const formatViews = (views) => {
         if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
         if (views >= 1000) return (views / 1000).toFixed(0) + 'K';
         return views;
    }

    return (
        <Link to={`/video/${video._id}`} className="suggestion-card-link">
            <div className="suggestion-card">
                <div className="suggestion-thumbnail-wrapper">
                    <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="suggestion-thumbnail" 
                    />
                    <span className="suggestion-duration">
                        {formatDuration(video.duration)}
                    </span>
                </div>
                <div className="suggestion-details">
                    <h4 className="suggestion-title">{video.title}</h4>
                    <span className="suggestion-channel-name">{video.owner.username}</span>
                    <div className="suggestion-stats">
                        <span>{formatViews(video.views)} views</span>
                        <span>• {new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoSuggestionCard;