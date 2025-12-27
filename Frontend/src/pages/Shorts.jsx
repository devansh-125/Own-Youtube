import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api.js';
import './Shorts.css';
import { Loader } from '../components/common/Loader.jsx';

function Shorts() {
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);
    const touchStartY = useRef(0);

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const response = await API.get('/videos?isShort=true');
                setShorts(response.data.data.docs || []);
                setLiked(false);
                setDisliked(false);
                setIsPlaying(true);
            } catch (error) {
                console.error("Error fetching shorts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShorts();
    }, []);

    // Handle keyboard arrow keys
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentIndex > 0) {
                    setCurrentIndex(prev => prev - 1);
                    setLiked(false);
                    setDisliked(false);
                    setIsPlaying(true);
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentIndex < shorts.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    setLiked(false);
                    setDisliked(false);
                    setIsPlaying(true);
                }
            } else if (e.key === ' ') {
                e.preventDefault();
                handlePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, shorts.length]);

    // Handle touch swipe gestures (two-finger swipe support)
    const handleTouchStart = (e) => {
        // Store initial Y position for swipe detection
        if (e.touches.length >= 1) {
            touchStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchEnd = (e) => {
        if (e.changedTouches.length === 0) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY.current - touchEndY;
        const minSwipeDistance = 40; // Reduced threshold for better responsiveness

        // Swipe up (next video)
        if (diff > minSwipeDistance && currentIndex < shorts.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setLiked(false);
            setDisliked(false);
            setIsPlaying(true);
        }
        // Swipe down (previous video)
        else if (diff < -minSwipeDistance && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setLiked(false);
            setDisliked(false);
            setIsPlaying(true);
        }
    };

    // Handle like
    const handleLike = async () => {
        try {
            const short = shorts[currentIndex];
            const response = await API.patch(`/likes/toggle/video/${short._id}`);
            console.log('Like response:', response);
            setLiked(!liked);
            setDisliked(false);
        } catch (error) {
            console.error("Error liking video:", error);
            if (error.response?.status === 401) {
                alert('Please login to like videos');
            } else {
                alert('Failed to like video. Please try again.');
            }
        }
    };

    // Handle dislike
    const handleDislike = async () => {
        try {
            const short = shorts[currentIndex];
            const response = await API.patch(`/likes/toggle/dislike/${short._id}`);
            console.log('Dislike response:', response);
            setDisliked(!disliked);
            setLiked(false);
        } catch (error) {
            console.error("Error disliking video:", error);
            if (error.response?.status === 401) {
                alert('Please login to dislike videos');
            } else {
                alert('Failed to dislike video. Please try again.');
            }
        }
    };

    // Handle play/pause
    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle subscribe
    const handleSubscribe = async () => {
        try {
            const short = shorts[currentIndex];
            const channelId = short.owner?._id;
            if (!channelId) {
                alert('Channel ID not found');
                return;
            }
            const response = await API.post(`/subscriptions/c/${channelId}`);
            console.log('Subscribe response:', response);
            alert('✅ Subscribed to channel!');
        } catch (error) {
            console.error("Error subscribing:", error);
            if (error.response?.status === 401) {
                alert('Please login to subscribe');
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to subscribe. Please try again.');
            }
        }
    };

    // Handle share
    const handleShare = async () => {
        try {
            const short = shorts[currentIndex];
            const shareText = `Check out this short: ${short.title}`;
            const shareUrl = `${window.location.origin}/shorts/${short._id}`;
            
            if (navigator.share) {
                await navigator.share({
                    title: short.title,
                    text: shareText,
                    url: shareUrl
                });
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(shareUrl);
                alert('✅ Link copied to clipboard!');
            }
        } catch (error) {
            console.error("Error sharing:", error);
            // If it's not a user cancellation, show alert
            if (error.name !== 'AbortError') {
                alert('Failed to share. Try again!');
            }
        }
    };

    if (loading) return <Loader />;

    if (shorts.length === 0) {
        return (
            <div className="shorts-container">
                <div className="short-video-card">
                    <div className="short-video-placeholder">
                        <div className="shorts-logo-large">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.77,10.32l-1.2-.5L18,8.06a3.74,3.74,0,0,0-3.5-5.5,3.7,3.7,0,0,0-1.63.38L6,6.37a3.7,3.7,0,0,0-2.14,3.34,3.73,3.73,0,0,0,2.54,3.54l1.2.5L6,15.44a3.74,3.74,0,0,0,3.5,5.5,3.7,3.7,0,0,0,1.63-.38l6.87-3.43a3.7,3.7,0,0,0,2.14-3.34A3.73,3.73,0,0,0,17.77,10.32ZM10,14.5v-5l4.5,2.5Z"></path>
                            </svg>
                        </div>
                        <h2>No Shorts found</h2>
                        <p>Be the first to upload a Short!</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentShort = shorts[currentIndex];

    return (
        <div 
            className="shorts-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="short-video-card">
                <video 
                    ref={videoRef}
                    src={currentShort.videoFile} 
                    autoPlay 
                    loop 
                    muted={isPlaying}
                    className="short-video-player"
                    onClick={handlePlayPause}
                />
                
                {!isPlaying && (
                    <div className="play-overlay">
                        <svg viewBox="0 0 24 24" fill="white" width="60" height="60">
                            <path d="M8 5v14l11-7z"></path>
                        </svg>
                    </div>
                )}
                
                <div className="short-actions">
                    <button 
                        className="short-action-btn"
                        onClick={handleLike}
                        style={{ background: liked ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.15)' }}
                    >
                        <svg viewBox="0 0 24 24" fill={liked ? 'red' : 'currentColor'} width="24" height="24">
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
                        </svg>
                        <span>{currentShort.likes?.length || 0}</span>
                    </button>
                    <button 
                        className="short-action-btn"
                        onClick={handleDislike}
                        style={{ background: disliked ? 'rgba(100, 100, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)' }}
                    >
                        <svg viewBox="0 0 24 24" fill={disliked ? '#6464ff' : 'currentColor'} width="24" height="24">
                            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L8.83 23l6.59-6.59c.37-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
                        </svg>
                        <span>Dislike</span>
                    </button>
                    <button className="short-action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z"></path>
                        </svg>
                        <span>Comments</span>
                    </button>
                    <button 
                        className="short-action-btn"
                        onClick={handleShare}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M15,5.63L20.66,12L15,18.37V14h-1c-3.96,0-7.14,2.4-8.4,6.12C6.12,15.33,9.76,12,14,12h1V5.63 M14,3v9c-4.97,0-9,4.03-9,9 c0-0.55,0.04-1.09,0.11-1.62C5.82,15.18,8.53,12,12,12h2v9l9-9L14,3L14,3z"></path>
                        </svg>
                        <span>Share</span>
                    </button>
                </div>

                <div className="short-info">
                    <div className="short-user">
                        <img src={currentShort.owner?.avatar} alt="" className="short-avatar-img" />
                        <span className="short-username">@{currentShort.owner?.username}</span>
                        <button 
                            className="nav-button" 
                            style={{ padding: '4px 12px', fontSize: '12px' }}
                            onClick={handleSubscribe}
                        >
                            Subscribe
                        </button>
                    </div>
                    <p className="short-title">{currentShort.title}</p>
                </div>
            </div>
            
            {shorts.length > 1 && (
                <div className="shorts-navigation">
                    <button 
                        disabled={currentIndex === 0} 
                        onClick={() => {
                            setCurrentIndex(prev => prev - 1);
                            setLiked(false);
                            setDisliked(false);
                        }}
                        title="Previous (Swipe Down or Click)"
                    >
                        ↑
                    </button>
                    <button 
                        disabled={currentIndex === shorts.length - 1} 
                        onClick={() => {
                            setCurrentIndex(prev => prev + 1);
                            setLiked(false);
                            setDisliked(false);
                        }}
                        title="Next (Swipe Up or Click)"
                    >
                        ↓
                    </button>
                </div>
            )}
        </div>
    );
}

export default Shorts;
