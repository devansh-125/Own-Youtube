import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import VideoCard from '../components/video/VideoCard.jsx';
import ProfileCard from '../components/user/ProfileCard.jsx';
import './Profile.css';

function Profile() {
    const { authUser } = useAuth();
    const navigate = useNavigate();
    const [channelData, setChannelData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser?.username) {
            setLoading(true);
            API.get(`/users/c/${authUser.username}`)
                .then(response => {
                    setChannelData(response.data.data);
                })
                .catch(error => {
                    console.error("Failed to fetch channel data:", error);
                    setChannelData(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [authUser]);

    if (loading) {
        return <div className='status-message'>Loading profile...</div>;
    }

    if (!authUser) {
        return <div className='status-message error'>Please log in to view your profile.</div>;
    }
    
    if (!channelData) {
        return <div className='status-message error'>Could not load your channel data.</div>;
    }

    return (
        <div className='profile-page'>
            <ProfileCard channel={channelData} />
            
            <hr className='separator' />

            <div className='profile-videos-grid'>
                <h2>Uploaded Videos</h2>
                {channelData.videos?.length > 0 ? (
                    <div className='video-grid'>
                        {channelData.videos.map(video => (
                            <VideoCard key={video._id} video={video} onProfilePage={true} />
                        ))}
                    </div>
                ) : (
                    <div className='empty-videos-state'>
                        <div className='empty-state-icon'>📝</div>
                        <h3>No content available</h3>
                        <p>Start sharing your story with the world. Click the button below to upload your first video.</p>
                        <button 
                            className='upload-videos-btn'
                            onClick={() => navigate('/upload-video')}
                        >
                            UPLOAD VIDEOS
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
