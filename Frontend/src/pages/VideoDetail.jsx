import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api.js';
import './VideoDetail.css';
import LikeButton from '../components/social/LikeButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function VideoDetail() {
  const { isLoggedIn } = useAuth();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (videoId) {
      const fetchVideoDetails = async () => {
        try {
          setLoading(true);
          const response = await API.get(`/videos/${videoId}`);
          const videoDataArray = response.data.data;

          if (videoDataArray && videoDataArray.length > 0) {
            setVideo(videoDataArray[0]);
            if (isLoggedIn) {
              await API.post(`/users/history/${videoId}`);
              console.log("Video added to watch history and view count updated.");
            }
          } else {
            throw new Error("Video not found");
          }
          setError(null);
        } catch (err) {
          setError("Failed to fetch video details.");
          console.error("API call failed:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVideoDetails();
    }
  }, [videoId]);

  if (loading) return <div className='status-message'>Loading...</div>;
  if (error) return <div className='status-message error'>{error}</div>;
  if (!video) return <div className='status-message'>Video not found.</div>;

  const uploadDate = new Date(video.createdAt).toLocaleDateString('en-US', {
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
            </div>
          </div>
          <button className='subscribe-btn'>Subscribe</button>
        </div>

        <div className='video-description-box'>
          <p>{video.discription}</p>
        </div>
      </div>

      <div className='secondary-column'>
        <h2 style={{margin: 0}}>Up Next</h2>
        {/* Recommended videos will go here */}
      </div>
    </div>
  );
}

export default VideoDetail;