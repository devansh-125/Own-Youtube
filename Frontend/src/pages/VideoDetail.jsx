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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-small">
                <path d="m15 10 5 5-5 5"></path>
                <path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
              </svg>
              Share
            </button>
            <button className='action-pill'>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-small">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                <path d="M5 3v4"></path>
                <path d="M19 17v4"></path>
                <path d="M3 5h4"></path>
                <path d="M17 19h4"></path>
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