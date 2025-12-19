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
    const [activeTab, setActiveTab] = useState('videos');

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

    const tabs = [
        { id: 'home', label: 'Home' },
        { id: 'videos', label: 'Videos' },
        { id: 'shorts', label: 'Shorts' },
        { id: 'playlists', label: 'Playlists' },
        { id: 'community', label: 'Community' },
    ];

    return (
        <div className='profile-page'>
            <div className='profile-header-wrapper'> 
                <ProfileCard channel={channelData} />
            </div>
            
            <div className='profile-tabs-container'>
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className='profile-content-section'>
                {activeTab === 'videos' && (
                    <div className='profile-videos-grid'>
                        {channelData.videos?.length > 0 ? (
                            <div className='video-grid'>
                                {channelData.videos.map(video => (
                                    <VideoCard key={video._id} video={video} onProfilePage={true} />
                                ))}
                            </div>
                        ) : (
                            <div className='empty-videos-state'>
                                <div className='empty-state-icon'>
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                                        <path d="M10 8l6 4-6 4V8zm11-5v18H3V3h18zm-1 1H4v16h16V4z"/>
                                    </svg>
                                </div>
                                <h3>No videos available</h3>
                                <p>Start sharing your story with the world. Click the button below to upload your first video.</p>
                                <button className='yt-action-btn primary' onClick={() => navigate('/upload-video')}>
                                    Upload video
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'shorts' && (
                    <div className='profile-videos-grid'>
                        {channelData.shorts?.length > 0 ? (
                            <div className='video-grid'>
                                {channelData.shorts.map(video => (
                                    <VideoCard key={video._id} video={video} onProfilePage={true} />
                                ))}
                            </div>
                        ) : (
                            <div className='empty-videos-state'>
                                <div className='empty-state-icon'>
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                                        <path d="M17.77,10.32l-1.2-.5L18,8.06a3.74,3.74,0,0,0-3.5-5.5,3.7,3.7,0,0,0-1.63.38L6,6.37a3.7,3.7,0,0,0-2.14,3.34,3.73,3.73,0,0,0,2.54,3.54l1.2.5L6,15.44a3.74,3.74,0,0,0,3.5,5.5,3.7,3.7,0,0,0,1.63-.38l6.87-3.43a3.7,3.7,0,0,0,2.14-3.34A3.73,3.73,0,0,0,17.77,10.32ZM10,14.5v-5l4.5,2.5Z"></path>
                                    </svg>
                                </div>
                                <h3>No shorts available</h3>
                                <p>Create your first short to see it here.</p>
                                <button className='yt-action-btn primary' onClick={() => navigate('/upload-video?type=short')}>
                                    Create short
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab !== 'videos' && activeTab !== 'shorts' && (
                    <div className='empty-videos-state'>
                        <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section is empty</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
