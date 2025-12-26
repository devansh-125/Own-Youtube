import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    try {
      setIsSearching(true);
      
      // Use hybrid search for best results (combines keyword + semantic)
      const response = await API.post('/search/hybrid', {
        query: query.trim(),
        limit: 20,
      });

      // Navigate to search results page
      navigate('/search-results', {
        state: {
          results: response.data.data.results,
          query: query.trim(),
          searchType: response.data.data.searchType,
        },
      });

      setQuery('');
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form className='search-bar' onSubmit={handleSearch}>
      <input
        type='text'
        placeholder='Search videos...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='search-input'
        disabled={isSearching}
        autoComplete='off'
      />
      <button
        type='submit'
        disabled={isSearching || !query.trim()}
        className='search-btn'
      >
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchBar;
