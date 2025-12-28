import React, { useState, useEffect, useRef, useCallback } from 'react';
import API from '../services/api.js';
import './Shorts.css';
import { Loader } from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Shorts() {
    const { authUser } = useAuth();
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef(null);
    const touchStartY = useRef(0);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const response = await API.get('/videos?isShort=true');
                const shortsData = response.data.data.docs || [];
                console.log("Shorts data received:", shortsData);
                if (shortsData.length > 0) {
                    console.log("First short owner data:", shortsData[0].owner);
                    console.log("isSubscribed value:", shortsData[0].owner?.isSubscribed);
                }
                setShorts(shortsData);
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

    // Handle play/pause
    const handlePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(prev => !prev);
        }
    }, [isPlaying]);

    // Handle keyboard arrow keys
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if user is typing in the comment input
            const isCommentInputFocused = 
                document.activeElement?.className?.includes('comment-input') ||
                document.activeElement?.tagName === 'TEXTAREA' ||
                document.activeElement?.tagName === 'INPUT' && 
                document.activeElement?.getAttribute('type') !== 'checkbox' &&
                document.activeElement?.getAttribute('type') !== 'radio';

            // If typing in comment input, allow normal key behavior
            if (isCommentInputFocused) {
                return;
            }

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
    }, [currentIndex, shorts.length, handlePlayPause]);

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
            
            // Update the shorts array with new like count
            const updatedShorts = [...shorts];
            updatedShorts[currentIndex] = {
                ...updatedShorts[currentIndex],
                likes: response.data.data.likes || [],
                dislikes: response.data.data.dislikes || []
            };
            setShorts(updatedShorts);
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
            
            // Update the shorts array with new dislike count
            const updatedShorts = [...shorts];
            updatedShorts[currentIndex] = {
                ...updatedShorts[currentIndex],
                likes: response.data.data.likes || [],
                dislikes: response.data.data.dislikes || []
            };
            setShorts(updatedShorts);
        } catch (error) {
            console.error("Error disliking video:", error);
            if (error.response?.status === 401) {
                alert('Please login to dislike videos');
            } else {
                alert('Failed to dislike video. Please try again.');
            }
        }
    };

    // Handle volume toggle
    const handleVolumeToggle = () => {
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.muted = false;
                videoRef.current.volume = volume;
                setIsMuted(false);
            } else {
                videoRef.current.muted = true;
                setIsMuted(true);
            }
        }
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
            setIsMuted(newVolume === 0);
        }
    };

    // Handle fullscreen
    const handleFullscreen = () => {
        if (!videoRef.current) return;
        
        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    // Show controls on mouse move
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    };

    // Reset video state when index changes
    useEffect(() => {
        if (videoRef.current && shorts.length > 0) {
            videoRef.current.currentTime = 0;
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [currentIndex, shorts.length, volume, isMuted]);

    // Handle fullscreen change event
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Cleanup controls timeout on unmount
    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

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
            
            // Update the shorts array to reflect subscription change
            const updatedShorts = [...shorts];
            updatedShorts[currentIndex] = {
                ...updatedShorts[currentIndex],
                owner: {
                    ...updatedShorts[currentIndex].owner,
                    isSubscribed: response.data.data.subscribed,
                    subscribersCount: response.data.data.subscribersCount
                }
            };
            setShorts(updatedShorts);
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

    // Load comments
    const loadComments = async () => {
        try {
            setLoadingComments(true);
            const short = shorts[currentIndex];
            const response = await API.get(`/comments/${short._id}`);
            // API returns paginated data with docs array
            const commentsData = response.data.data?.docs || response.data.data || [];
            setComments(commentsData);
            
            // Update the shorts array with the correct comment count for this video
            const updatedShorts = [...shorts];
            updatedShorts[currentIndex] = {
                ...updatedShorts[currentIndex],
                commentsCount: commentsData.length
            };
            setShorts(updatedShorts);
        } catch (error) {
            console.error("Error loading comments:", error);
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    // Add comment
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            return;
        }

        try {
            const short = shorts[currentIndex];
            await API.post(`/comments/${short._id}`, {
                content: newComment
            });
            setNewComment('');
            await loadComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    // Edit comment
    const handleEditComment = async (commentId, newText) => {
        if (!newText.trim()) {
            return;
        }

        try {
            await API.patch(`/comments/${commentId}`, {
                content: newText
            });
            setEditingCommentId(null);
            setEditingCommentText('');
            await loadComments();
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    // Delete comment
    const handleDeleteComment = async (commentId) => {
        // Show custom delete confirmation
        setDeletingCommentId(commentId);
    };

    // Confirm delete
    const confirmDeleteComment = async (commentId) => {
        try {
            // Use correct route: /comments/c/:commentId
            await API.delete(`/comments/c/${commentId}`);
            setDeletingCommentId(null);
            await loadComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
            setDeletingCommentId(null);
        }
    };

    // Toggle comments panel
    const toggleComments = () => {
        if (!showComments) {
            loadComments();
        }
        setShowComments(!showComments);
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
    const commentCount = currentShort?.commentsCount || 0;
    
    // Check if current user has liked/disliked the current short
    const isCurrentShortLiked = currentShort?.likes?.includes(authUser?._id);
    const isCurrentShortDisliked = currentShort?.dislikes?.includes(authUser?._id);

    return (
        <div 
            className="shorts-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseMove={handleMouseMove}
        >
            <div className="short-video-card">
                <video 
                    ref={videoRef}
                    src={currentShort.videoFile} 
                    autoPlay 
                    loop 
                    muted={isMuted}
                    className="short-video-player"
                    onClick={handlePlayPause}
                />
                
                {/* Top Controls Overlay */}
                <div className={`short-video-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
                    <div className="short-controls-left">
                        <button 
                            className="short-control-btn"
                            onClick={handlePlayPause}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                    <path d="M8 5v14l11-7z"></path>
                                </svg>
                            )}
                        </button>
                        <div className="short-volume-control">
                            <button 
                                className="short-control-btn"
                                onClick={handleVolumeToggle}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted || volume === 0 ? (
                                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>
                                    </svg>
                                ) : volume < 0.5 ? (
                                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"></path>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                                    </svg>
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="short-volume-slider"
                            />
                        </div>
                    </div>
                    <div className="short-controls-right">
                        <button 
                            className="short-control-btn"
                            aria-label="Captions"
                        >
                            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10zm-2-1H7v-2h10v2zm0-4H7v-2h10v2z"></path>
                            </svg>
                        </button>
                        <button 
                            className="short-control-btn"
                            aria-label="More options"
                        >
                            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                            </svg>
                        </button>
                        <button 
                            className="short-control-btn"
                            onClick={handleFullscreen}
                            aria-label="Fullscreen"
                        >
                            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                {!isPlaying && (
                    <div className="play-overlay">
                        <svg viewBox="0 0 24 24" fill="white" width="60" height="60">
                            <path d="M8 5v14l11-7z"></path>
                        </svg>
                    </div>
                )}
                
                {/* Right Action Buttons */}
                <div className="short-actions">
                    <div className="short-action-stack">
                        <button 
                            className="short-action-btn"
                            onClick={handleLike}
                            aria-label="Like"
                        >
                            <svg viewBox="0 0 24 24" fill={isCurrentShortLiked ? '#3b82f6' : 'white'} width="24" height="24">
                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
                            </svg>
                        </button>
                        <span className="short-action-label">{currentShort.likes?.length || 0}</span>
                    </div>
                    <div className="short-action-stack">
                        <button 
                            className="short-action-btn"
                            onClick={handleDislike}
                            aria-label="Dislike"
                        >
                            <svg viewBox="0 0 24 24" fill={isCurrentShortDisliked ? '#3b82f6' : 'white'} width="24" height="24">
                                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L8.83 23l6.59-6.59c.37-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
                            </svg>
                        </button>
                        <span className="short-action-label">Dislike</span>
                    </div>
                    <div className="short-action-stack">
                        <button 
                            className="short-action-btn"
                            onClick={toggleComments}
                            aria-label="Comments"
                        >
                            <svg viewBox="0 0 24 24" fill={showComments ? '#ff0000' : 'white'} width="24" height="24">
                                <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z"></path>
                            </svg>
                        </button>
                        <span className="short-action-label">{commentCount}</span>
                    </div>
                    <div className="short-action-stack">
                        <button 
                            className="short-action-btn"
                            onClick={handleShare}
                            aria-label="Share"
                        >
                            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                <path d="M15,5.63L20.66,12L15,18.37V14h-1c-3.96,0-7.14,2.4-8.4,6.12C6.12,15.33,9.76,12,14,12h1V5.63 M14,3v9c-4.97,0-9,4.03-9,9 c0-0.55,0.04-1.09,0.11-1.62C5.82,15.18,8.53,12,12,12h2v9l9-9L14,3L14,3z"></path>
                            </svg>
                        </button>
                        <span className="short-action-label">Share</span>
                    </div>
                    <div className="short-action-stack">
                        <button 
                            className="short-action-btn"
                            aria-label="Remix"
                        >
                            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"></path>
                            </svg>
                        </button>
                        <span className="short-action-label">Remix</span>
                    </div>
                </div>

                {/* Scroll Indicator */}
                {currentIndex < shorts.length - 1 && (
                    <div className="short-scroll-indicator">
                        <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                        </svg>
                    </div>
                )}

                <div className="short-info">
                    <div className="short-user-row">
                        <div className="short-user">
                            <img src={currentShort.owner?.avatar} alt="" className="short-avatar-img" />
                            <span className="short-username">@{currentShort.owner?.username}</span>
                        </div>
                        {authUser?._id !== currentShort.owner?._id && (
                            <button
                                className={`short-subscribe-btn ${currentShort.owner?.isSubscribed ? 'subscribed' : ''}`}
                                onClick={handleSubscribe}
                                aria-label={`Subscribe to ${currentShort.owner?.username}`}
                            >
                                {currentShort.owner?.isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        )}
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

            {/* Delete Confirmation Modal */}
            {deletingCommentId && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h3>Delete comment?</h3>
                        <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                            <button 
                                className="delete-modal-btn cancel"
                                onClick={() => setDeletingCommentId(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="delete-modal-btn delete"
                                onClick={() => confirmDeleteComment(deletingCommentId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`comments-panel ${showComments ? 'active' : ''}`}>
                <div className="comments-header">
                    <h3>Comments</h3>
                    <button 
                        className="close-comments-btn"
                        onClick={() => setShowComments(false)}
                    >
                        ✕
                    </button>
                </div>

                {loadingComments ? (
                    <div className="comments-loading">Loading...</div>
                ) : (
                    <>
                        <div className="comments-list">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment._id} className="comment-item">
                                        <img 
                                            src={comment.owner?.avatar || 'https://via.placeholder.com/32'} 
                                            alt="avatar"
                                            className="comment-avatar"
                                        />
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <span className="comment-username">@{comment.owner?.username}</span>
                                                {authUser?._id === comment.owner?._id && (
                                                    <div className="comment-actions">
                                                        <button 
                                                            className="comment-action-btn"
                                                            onClick={() => {
                                                                setEditingCommentId(comment._id);
                                                                setEditingCommentText(comment.content);
                                                            }}
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button 
                                                            className="comment-action-btn"
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            title="Delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {editingCommentId === comment._id ? (
                                                <div className="comment-edit-area">
                                                    <input
                                                        type="text"
                                                        value={editingCommentText}
                                                        onChange={(e) => setEditingCommentText(e.target.value)}
                                                        className="comment-edit-input"
                                                        autoFocus
                                                    />
                                                    <div className="comment-edit-actions">
                                                        <button 
                                                            className="comment-edit-btn save"
                                                            onClick={() => handleEditComment(comment._id, editingCommentText)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button 
                                                            className="comment-edit-btn cancel"
                                                            onClick={() => {
                                                                setEditingCommentId(null);
                                                                setEditingCommentText('');
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="comment-text">{comment.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-comments">No comments yet</div>
                            )}
                        </div>

                        <div className="comments-input-area">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                className="comment-input"
                            />
                            <button 
                                className="send-comment-btn"
                                onClick={handleAddComment}
                            >
                                Send
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Shorts;
