import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard.jsx';
import './SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('');

  useEffect(() => {
    if (location.state?.results) {
      setResults(location.state.results);
      setQuery(location.state.query || '');
      setSearchType(location.state.searchType || 'hybrid');
    } else {
      // If no search results in state, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  return (
    <div className='search-results-container'>
      <div className='search-header'>
        <h2 className='search-title'>
          Search Results for "<span className='search-query'>{query}</span>"
        </h2>
        <p className='search-info'>
          Found {results.length} video{results.length !== 1 ? 's' : ''} using{' '}
          <span className='search-type'>{searchType}</span> search
        </p>
      </div>

      {results.length > 0 ? (
        <div className='video-grid search-grid'>
          {results.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className='no-results'>
          <div className='no-results-icon'>🔍</div>
          <h3>No videos found</h3>
          <p>Try a different search or browse our collection</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
