import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ShortsCard({ short }) {
    const [imageError, setImageError] = useState(false);

    const getThumbnail = () => {
        // Try multiple thumbnail sources
        if (short?.thumbnail && !imageError) {
            return short.thumbnail;
        }
        if (short?.poster && !imageError) {
            return short.poster;
        }
        if (short?.videoFile && !imageError) {
            // Video file as last resort - will show as video poster
            return short.videoFile;
        }
        // Return a dark placeholder
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="480"%3E%3Crect fill="%23222" width="280" height="480"/%3E%3C/svg%3E';
    };

    const channelName = short?.owner?.username || 'Unknown';
    const title = short?.title || 'Untitled Short';

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <Link to={`/shorts/${short._id}`} className="shorts-card" title={title}>
            <img 
                src={getThumbnail()} 
                alt={title}
                className="shorts-card-image"
                loading="lazy"
                onError={handleImageError}
            />
            <div className="shorts-card-overlay">
                <div className="shorts-card-title">{title}</div>
                <div className="shorts-card-channel">{channelName}</div>
            </div>
        </Link>
    );
}

export default ShortsCard;
