import React, { useState, useEffect } from 'react';
import { useParams , Link} from 'react-router-dom';
import API from '../services/api.js';
import './VideoDetail.css';
import LikeButton from '../components/social/LikeButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CommentList from '../components/social/CommentList.jsx';
import SubscribeButton from '../components/social/SubscribeButton.jsx';
import VideoCard from '../components/video/VideoCard.jsx'; 
import UpNextVideos from '../components/video/UpNextVideo.jsx';
import ShareModal from '../components/social/ShareModal.jsx';

function VideoDetail() {
  const { isLoggedIn } = useAuth();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [upNextVideos, setUpNextVideos] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both the main video and the "Up Next" list concurrently
        const [videoResponse, upNextResponse] = await Promise.all([
          API.get(`/videos/${videoId}`),
          API.get('/videos') // API call to get all videos
        ]); 

        // Process main video data
        const videoData = videoResponse.data.data;
        if (videoData) {
          setVideo(videoData);
          if (isLoggedIn) {
            await API.post(`/users/history/${videoId}`);
          }
        } else {
          throw new Error("Video not found");
        }

        // 2. PROCESS AND SET "UP NEXT" VIDEOS
        const allVideos = upNextResponse.data.data.videos; 
        if (allVideos && Array.isArray(allVideos)) {
          const filteredVideos = allVideos.filter(v => v._id !== videoId);
          setUpNextVideos(filteredVideos);
        }

        setError(null);
      } catch (err) {
        setError("Failed to fetch page data.");
        console.error("API call failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchData();
    }
    // Scroll to top when the videoId changes
    window.scrollTo(0, 0);
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

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  if (loading) return <div className='status-message'>Loading...</div>;
  if (error) return <div className='status-message error'>{error}</div>;
  if (!video) return <div className='status-message'>Video not found.</div>;

  const uploadDate = new Date(video.createdAt).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
    <div className='video-detail-page'>
      <div className='primary-column'>
        <div className='video-player-wrapper'>
          <video className='video-player' src={video.videoFile} controls autoPlay />
        </div>

        <h1 className='video-title-detail'>{video.title}</h1>

        <div className='video-header-row'>
          <div className='channel-info-section'>
            <img src={video.owner?.avatar} alt={video.owner?.username} className='channel-avatar-detail'/>
            <div className='channel-text'>
              <h3 className='channel-name-detail'>{video.owner?.username}</h3>
              <span className='sub-count'>{video.owner?.subscribersCount} subscribers</span>
            </div>
            <SubscribeButton 
              channel={video.owner} 
              onSubscriptionChange={handleSubscriptionChange} 
            />
          </div>

          <div className='action-buttons'>
            <LikeButton video={video} /> 
            <button className='action-pill' onClick={handleShare}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="icon-small">
                <path d="M15,5.63L20.66,12L15,18.37V14h-1c-3.96,0-7.14,2.4-8.4,6.12C6.12,15.33,9.76,12,14,12h1V5.63 M14,3v9c-4.97,0-9,4.03-9,9 c0-0.55,0.04-1.09,0.11-1.62C5.82,15.18,8.53,12,12,12h2v9l9-9L14,3L14,3z"></path>
              </svg>
              Share
            </button>
            <button className='action-pill'>
              <svg viewBox="0 0 24 24" fill="currentColor" className="icon-small">
                <path d="M12,2L14.5,9.5L22,12L14.5,14.5L12,22L9.5,14.5L2,12L9.5,9.5L12,2M12,5.5L10.7,9.3L6.9,10.6L10.7,11.9L12,15.7L13.3,11.9L17.1,10.6L13.3,9.3L12,5.5M7,4L8,6.5L10.5,7.5L8,8.5L7,11L6,8.5L3.5,7.5L6,6.5L7,4M18,13L19,15.5L21.5,16.5L19,17.5L18,20L17,17.5L14.5,16.5L17,15.5L18,13Z"></path>
              </svg>
              Ask AI
            </button>
          </div>
        </div>

        <div className='video-description-box'>
          <div className='video-stats-inner'>
            <span>{video.views} views</span>
            <span>{uploadDate}</span>
          </div>
          <p>{video.discription}</p>
        </div>

        <CommentList videoId={videoId} />
      </div>

      <div className="sidebar-content">
        <UpNextVideos 
          currentVideoId={video._id} 
          channelId={video.owner?._id} 
        />
      </div>
    </div>
    <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        videoTitle={video.title} 
        videoUrl={window.location.href} 
    />
    </>
  );
}


export default VideoDetail;