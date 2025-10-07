import React from 'react'
import { Link } from 'react-router-dom';
import './VideoCard.css';

function VideoCard({ video }) {
  // Destructure props for easier access
  const { thumbnail, title, owner } = video;

  return (
    <Link to={`/video/${video._id}`} className='video-card-link'>
      <div className='video-card'>
        <img src={thumbnail} alt={title} className='thumbnail-img' />
        <div className='video-details'>
          <img src={owner.avatar} alt={owner.fullName} className='channel-avatar' />
          <div className='video-text'>
            <h3 className='video-title'>{title}</h3>
            <p className='channel-name'>{owner.fullName}</p>
            {/* You can add views and upload date here later */}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard;