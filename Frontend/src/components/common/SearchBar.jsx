import { useState } from 'react';
import { useSearch } from '../../context/SearchContext.jsx';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const { performSearch, isSearching, clearSearch } = useSearch();

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log('🔍 Search button clicked!');

    if (!query.trim()) {
      console.log('❌ Query is empty, clearing search');
      clearSearch();
      return;
    }

    console.log('✅ Starting search for:', query.trim());
    await performSearch(query.trim());
    console.log('✅ Search completed');
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
