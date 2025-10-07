import React from 'react';
import './ProfileCard.css'; // Make sure this path is correct

function ProfileCard({ channel }) { // It now accepts a 'channel' prop
    // If there's no channel data, don't render anything
    if (!channel) {
        return null;
    }

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
                {/* Subscribe button would go here */}
            </div>
        </div>
    );
}

export default ProfileCard;