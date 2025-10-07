import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../services/api.js';
import VideoCard from '../components/video/VideoCard.jsx';
import ProfileCard from '../components/user/ProfileCard.jsx';
import './Profile.css'; // Make sure this import is here

function Profile() {
    const { authUser } = useAuth();
    const [channelData, setChannelData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser?.username) {
            API.get(`/users/c/${authUser.username}`)
                .then(response => {
                    setChannelData(response.data.data);
                })
                .catch(error => console.error("Failed to fetch channel data:", error))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [authUser]);

    if (loading) return <div className='status-message'>Loading profile...</div>;
    if (!channelData) return <div className='status-message error'>Could not load channel data.</div>;

    return (
        <div className='profile-page'>
            <ProfileCard channel={channelData} />
            <hr className='separator' />
            <div className='profile-videos-grid'>
                <h2>Uploaded Videos</h2>
                <div className='video-grid'>
                    {channelData.videos?.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;