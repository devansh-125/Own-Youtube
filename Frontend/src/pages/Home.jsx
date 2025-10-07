import React, { useState, useEffect } from 'react';
import VideoCard from '../components/video/VideoCard.jsx';
import './Home.css';
import axios from 'axios'; // Import axios to make API calls

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We use an async function inside useEffect to fetch data
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Make sure your backend server is running on port 8000
        const response = await axios.get('http://localhost:8000/api/v1/videos'); 
        
        // Assuming your API sends back data in a 'data' property
        setVideos(response.data.data.docs); 
        setError(null);
      } catch (err) {
        setError("Failed to fetch videos. Please make sure the server is running.");
        console.error("API call failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // The empty array [] means this effect runs only once when the component mounts

  // Conditional Rendering based on state
  if (loading) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading videos...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '2rem' }}>Error: {error}</div>;
  }

  return (
    <div className='home-container'>
      <div className='video-grid'>
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Home;