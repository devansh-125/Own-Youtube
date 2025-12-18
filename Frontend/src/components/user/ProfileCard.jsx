import React from 'react';
// Step 1: Import useNavigate
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';

function ProfileCard({ channel }) {
    const navigate = useNavigate();

    if (!channel) {
        return null;
    }

    return (
        <div className='profile-card-wrapper'>
            <div className='channel-banner-container'>
                <img 
                    src={channel.coverImage} 
                    alt="Channel Banner" 
                    className='channel-banner' 
                />
            </div>
            
            <div className='channel-header-content'>
                <div className='channel-avatar-container'>
                    <img 
                        src={channel.avatar} 
                        alt={channel.fullName} 
                        className='channel-avatar-large' 
                    />
                </div>
                
                <div className='channel-info-container'>
                    <h1 className='channel-name-large'>{channel.fullName}</h1>
                    <div className='channel-meta-info'>
                        <span>@{channel.username}</span>
                        <span className='dot-separator'>•</span>
                        <span>{channel.subscribersCount} subscribers</span>
                        <span className='dot-separator'>•</span>
                        <span>{channel.videosCount} videos</span>
                    </div>
                    <p className='channel-description-snippet'>
                        {channel.description || "More about this channel >"}
                    </p>
                    
                    <div className='channel-action-buttons'>
                        <button 
                            className='yt-action-btn primary'
                            onClick={() => navigate('/upload-video')}
                        >
                            Customize channel
                        </button>
                        <button 
                            className='yt-action-btn secondary'
                            onClick={() => navigate('/upload-video')}
                        >
                            Manage videos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
