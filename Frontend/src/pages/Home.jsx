import React, { useState, useEffect } from 'react';
import VideoCard from '../components/video/VideoCard.jsx';
import { useSearch } from '../context/SearchContext.jsx';
import './Home.css';
import API from '../services/api.js';

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchResults, searchQuery, searchType, isSearching } = useSearch();

  useEffect(() => {
    // We use an async function inside useEffect to fetch data
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await API.get('/videos?isShort=false'); 
        
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
  if (isSearching) {
    return <div style={{ color: 'white', padding: '2rem' }}>Searching videos...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '2rem' }}>Error: {error}</div>;
  }

  // Show search results if we have them
  if (searchResults.length > 0) {
    return (
      <div className='home-container'>
        <div className='search-header' style={{ padding: '1rem', color: 'white' }}>
          <h2>Search Results for "{searchQuery}"</h2>
          <p>Found {searchResults.length} video{searchResults.length !== 1 ? 's' : ''} using {searchType} search</p>
        </div>
        <div className='video-grid'>
          {searchResults.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    );
  }

  // Show regular videos if no search
  if (loading) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading videos...</div>;
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