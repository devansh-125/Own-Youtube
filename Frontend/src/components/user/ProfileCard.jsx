import React from 'react';
// Step 1: Import useNavigate
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';

function ProfileCard({ channel }) {
    // Step 2: Initialize the navigate function
    const navigate = useNavigate();

    if (!channel) {
        return null;
    }

    return (
        <div className='profile-card-wrapper'>
            <div className='profile-header'>
                <img 
                    src={channel.coverImage} 
                    alt="Cover" 
                    className='cover-image' 
                />
                <div className='profile-details'>
                    <img 
                        src={channel.avatar} 
                        alt="Avatar" 
                        className='profile-avatar-page' 
                    />
                    <div className='profile-text'>
                        <h1>{channel.fullName}</h1>
                        <p>@{channel.username}</p>
                        <p>{channel.subscribersCount} Subscribers • {channel.videosCount} Videos</p>
                    </div>
                    
                    <div className='profile-actions'>
                        {/* Step 3: Add the onClick handler to the button */}
                        <button 
                            className='upload-video-btn-profile'
                            onClick={() => navigate('/upload-video')}
                        >
                            Upload Video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
