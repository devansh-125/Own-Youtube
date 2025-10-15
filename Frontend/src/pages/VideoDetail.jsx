import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api.js';
import './VideoDetail.css';
import LikeButton from '../components/social/LikeButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CommentList from '../components/social/CommentList.jsx';
import SubscribeButton from '../components/social/SubscribeButton.jsx';
import VideoCard from '../components/video/VideoCard.jsx'; 

function VideoDetail() {
  const { isLoggedIn } = useAuth();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const videoResponse = await API.get(`/videos/${videoId}`);
        const videoData = videoResponse.data.data;

        if (videoData) {
          setVideo(videoData);
          if (isLoggedIn) {
            await API.post(`/users/history/${videoId}`);
          }
        } else {
          throw new Error("Video not found");
        }

        const recommendedResponse = await API.get('/videos');
        const videosArray = recommendedResponse.data.data.videos; 

        if (videosArray && Array.isArray(videosArray)) {
          const filteredVideos = videosArray.filter(v => v._id !== videoId);
          setRecommendedVideos(filteredVideos);
        }

        setError(null);
      } catch (err) {
        setError("Failed to fetch video details.");
        console.error("API call failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchData();
    }
  }, [videoId, isLoggedIn]);

  // This function updates the parent's state when the child button is clicked
  const handleSubscriptionChange = (newIsSubscribed, newSubscribersCount) => {
    setVideo(prevVideo => ({
      ...prevVideo,
      owner: {
        ...prevVideo.owner,
        isSubscribed: newIsSubscribed,
        subscribersCount: newSubscribersCount,
      }
    }));
  };

  if (loading) return <div className='status-message'>Loading...</div>;
  if (error) return <div className='status-message error'>{error}</div>;
  if (!video) return <div className='status-message'>Video not found.</div>;

  const uploadDate = new Date(video.createdAt).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className='video-detail-page'>
      <div className='primary-column'>
        <div className='video-player-wrapper'>
          <video className='video-player' src={video.videoFile} controls autoPlay />
        </div>

        <div className='video-info-container'>
          <h1 className='video-title-detail'>{video.title}</h1>
          <div className='video-metadata-actions'>
            <div className='video-stats'>
                <span>{video.views} views</span>
                <span>•</span>
                <span>{uploadDate}</span>
            </div>
            <div className='action-buttons'>
                <LikeButton video={video} /> 
                <button className='action-btn-placeholder'>🔗 Share</button>
            </div>
          </div>
        </div>
        
        <hr className='separator' />

        <div className='channel-info-bar'>
          <div className='channel-details'>
            <img src={video.owner?.avatar} alt={video.owner?.username} className='channel-avatar-detail'/>
            <div className='channel-text'>
              <h3 className='channel-name-detail'>{video.owner?.username}</h3>
              {/* The redundant subscriber count that was here has been removed */}
            </div>
          </div>
          <SubscribeButton 
            channel={video.owner} 
            onSubscriptionChange={handleSubscriptionChange} 
          />
        </div>

        <div className='video-description-box'>
          <p>{video.discription}</p>
        </div>
         <CommentList videoId={videoId} />
      </div>

      <div className='secondary-column'>
        <h2 style={{margin: 0}}>Up Next</h2>
        {recommendedVideos.map((recVideo) => (
          <VideoCard key={recVideo._id} video={recVideo} />
        ))}
      </div>
    </div>
  );
}

export default VideoDetail;