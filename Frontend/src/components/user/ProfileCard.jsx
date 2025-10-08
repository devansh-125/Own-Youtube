import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';

function ProfileCard({ channel }) {
    const navigate = useNavigate();

    if (!channel) {
        return null; // Don't render anything if there's no channel data yet
    }

    return (
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
                    <button 
                        className='upload-video-btn-profile'
                        onClick={() => navigate('/upload-video')}
                    >
                        Upload Video
                    </button>
                    {/* An "Edit Profile" button can be added here later */}
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
