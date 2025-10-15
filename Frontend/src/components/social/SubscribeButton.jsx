import React, { useState, useEffect } from 'react';
import API from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './SubscribeButton.css';

function SubscribeButton({ channel, onSubscriptionChange }) {
    const { isLoggedIn, authUser } = useAuth();
    const navigate = useNavigate();

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);

    // Syncs component state if the channel prop changes
    useEffect(() => {
        if (channel) {
            setIsSubscribed(channel.isSubscribed);
            setSubscribersCount(channel.subscribersCount);
        }
    }, [channel]);

    const handleToggleSubscription = async () => {
        if (!isLoggedIn) {
            alert("Please log in to subscribe!");
            navigate('/login');
            return;
        }

        try {
            const response = await API.post(`/subscriptions/c/${channel._id}`);
            const data = response.data.data;

            // Update this component's local state
            setIsSubscribed(data.subscribed);
            setSubscribersCount(data.subscribersCount);

            // Call the parent's function to update its state
            if (onSubscriptionChange) {
                onSubscriptionChange(data.subscribed, data.subscribersCount);
            }

        } catch (error) {
            console.error("Failed to toggle subscription:", error);
            alert("Something went wrong. Please try again.");
        }
    };
    
    // Hide button if the viewer is the channel owner
    if (authUser?._id === channel?._id) {
        return null;
    }

    return (
        <div className="subscription-container">
            <span className="subscriber-count">{subscribersCount} Subscribers</span>
            <button
                className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleToggleSubscription}
            >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    );
}

export default SubscribeButton;