import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VideoDetail.css'; // Styling ke liye CSS file import karenge

function VideoDetail() {
  // URL se videoId nikalne ke liye (e.g., /video/12345 -> videoId = "12345")
  const { videoId } = useParams(); 
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Jab bhi videoId badlega, yeh function chalega
    if (videoId) {
      const fetchVideoDetails = async () => {
        try {
          setLoading(true);
          // Backend API ko call karke specific video ka data maangenge
          const response = await axios.get(`http://localhost:8000/api/v1/videos/${videoId}`);
          
          // Aapka `getVideoById` controller ek array return karta hai, isliye hum pehla element lenge
          setVideo(response.data.data[0]); 
          setError(null);
        } catch (err) {
          setError("Failed to fetch video details. Please check the video ID and server.");
          console.error("API call failed:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVideoDetails();
    }
  }, [videoId]);

  // --- Loading aur Error states ko handle karna ---
  if (loading) {
    return <div className='status-message'>Loading...</div>;
  }

  if (error) {
    return <div className='status-message error'>{error}</div>;
  }

  if (!video) {
    return <div className='status-message'>Video not found.</div>;
  }

  // --- Jab data aa jayega toh yeh render hoga ---
  return (
    <div className='video-detail-container'>
      <div className='video-player-wrapper'>
        <video
          className='video-player'
          src={video.videoFile} // Cloudinary se video ka URL
          controls
          autoPlay
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <h1 className='video-title-detail'>{video.title}</h1>

      <div className='channel-info-bar'>
        <div className='channel-details'>
          <img 
              src={video.owner?.avatar} 
              alt={video.owner?.username} 
              className='channel-avatar-detail'
          />
          <h3 className='channel-name-detail'>{video.owner?.username}</h3>
        </div>
        {/* Yahan hum subscribe button aur like/dislike buttons baad mein add kar sakte hain */}
      </div>

      <div className='video-description-box'>
        <p>{video.discription}</p> {/* Aapki spelling use ki hai */}
      </div>

      {/* Yahan hum comments section baad mein add karenge */}
    </div>
  );
}

export default VideoDetail;