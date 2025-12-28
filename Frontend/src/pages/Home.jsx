import React, { useState, useEffect } from 'react';
import VideoCard from '../components/video/VideoCard.jsx';
import ShortsCard from '../components/video/ShortsCard.jsx';
import { useSearch } from '../context/SearchContext.jsx';
import './Home.css';
import API from '../services/api.js';

function Home() {
  const [longVideos, setLongVideos] = useState([]);
  const [shortVideos, setShortVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchResults, searchQuery, searchType, isSearching } = useSearch();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // Fetch long videos
        const longVideoResponse = await API.get('/videos?isShort=false');
        const longVideoData = longVideoResponse.data.data.docs || [];
        
        // Fetch short videos, sorted by views (descending)
        const shortVideoResponse = await API.get('/videos?isShort=true');
        let shortVideoData = shortVideoResponse.data.data.docs || [];
        
        // Sort shorts by views and take top 5
        shortVideoData = shortVideoData
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);
        
        setLongVideos(longVideoData);
        setShortVideos(shortVideoData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch videos. Please make sure the server is running.");
        console.error("API call failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

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

  // Split long videos: first 3 for initial grid, rest for after shorts
  const firstThreeVideos = longVideos.slice(0, 3);
  const remainingVideos = longVideos.slice(3);

  return (
    <div className='home-container'>
      {/* First 3 long videos */}
      <div className='video-grid'>
        {firstThreeVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {/* Shorts Section */}
      {shortVideos.length > 0 && (
        <div className='shorts-section'>
          <h2 className='shorts-section-title'>Shorts</h2>
          <div className='shorts-horizontal-scroll'>
            {shortVideos.map((short) => (
              <ShortsCard key={short._id} short={short} />
            ))}
          </div>
        </div>
      )}

      {/* Remaining long videos */}
      {remainingVideos.length > 0 && (
        <div className='video-grid'>
          {remainingVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;