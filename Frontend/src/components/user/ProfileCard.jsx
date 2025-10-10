import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';

function ProfileCard({ channel }) {
    const navigate = useNavigate();

    if (!channel) {
        return null;
    }

    // Add this new wrapper div
    return (
        <div className='profile-card-wrapper'>
            <div className='profile-header'>
                <img 
                    src={channel.coverImage} 
                    alt="Cover" 
                    className='cover-image' 
                />
                <div className='profile-details'>
                    {/* ... all your other content ... */}
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
                        <button className='upload-video-btn-profile'>
                            Upload Video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;