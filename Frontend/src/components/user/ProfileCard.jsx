import React from 'react';
import './ProfileCard.css'; // Make sure this import is here

function ProfileCard({ channel }) {
    if (!channel) return null;

    return (
        <div className='profile-header'>
            <img src={channel.coverImage} alt="Cover" className='cover-image' />
            <div className='profile-details'>
                <img src={channel.avatar} alt="Avatar" className='profile-avatar-page' />
                <div className='profile-text'>
                    <h1>{channel.fullName}</h1>
                    <p>@{channel.username}</p>
                    <p>{channel.subscribersCount} Subscribers • {channel.videosCount} Videos</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;