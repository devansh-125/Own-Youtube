import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import './Subscriptions.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Subscriptions() {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser?._id) {
            const fetchSubscriptions = async () => {
                try {
                    setLoading(true);
                    const response = await API.get(`/subscriptions/u/${authUser._id}`);
                    const channelsData = response.data.data || [];
                    // Extract the actual channel data from the nested structure
                    const formattedChannels = channelsData.map(item => item.subscribedChannel).filter(Boolean);
                    setChannels(formattedChannels);
                    setError(null);
                } catch (err) {
                    setError("Failed to fetch subscriptions. Please try again later.");
                    console.error("API call failed:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSubscriptions();
        }
    }, [authUser]);

    const handleChannelClick = (channelId) => {
        navigate(`/profile?userId=${channelId}`);
    };

    if (loading) {
        return <div className='status-message'>Loading subscriptions...</div>;
    }

    if (!authUser) {
        return <div className='status-message'>Please log in to see your subscriptions.</div>;
    }

    if (error) {
        return <div className='status-message error'>{error}</div>;
    }

    return (
        <div className='subscriptions-page'>
            <div className='subscriptions-header'>
                <h1>All subscriptions</h1>
                <div className='sort-dropdown'>
                    <select>
                        <option>Most relevant</option>
                        <option>Recently added</option>
                        <option>A to Z</option>
                    </select>
                </div>
            </div>

            {channels.length > 0 ? (
                <div className='channels-list'>
                    {channels.map((channel) => (
                        <div 
                            key={channel._id} 
                            className='channel-item'
                            onClick={() => handleChannelClick(channel._id)}
                        >
                            <img 
                                src={channel.avatar} 
                                alt={channel.fullName}
                                className='channel-avatar'
                            />
                            <div className='channel-info'>
                                <h3 className='channel-name'>{channel.fullName}</h3>
                                <p className='channel-username'>@{channel.username}</p>
                                <p className='channel-description'>Subscribed</p>
                            </div>
                            <button className='subscribe-btn subscribed'>
                                ✓ Subscribed
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='empty-state'>
                    <h2>No subscriptions yet</h2>
                    <p>Subscribe to channels to see them here.</p>
                </div>
            )}
        </div>
    );
}

export default Subscriptions;
