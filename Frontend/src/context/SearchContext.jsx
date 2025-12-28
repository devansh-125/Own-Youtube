import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (query) => {
    if (!query.trim()) {
      // Clear search results when query is empty
      setSearchResults([]);
      setSearchQuery('');
      setSearchType('');
      return;
    }

    try {
      setIsSearching(true);
      setSearchQuery(query);

      const response = await fetch('http://localhost:8000/api/v1/search/hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: query.trim(),
          limit: 20,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.results) {
        setSearchResults(data.data.results);
        setSearchType(data.data.searchType || 'hybrid');
      } else {
        setSearchResults([]);
        setSearchType('');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchType('');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
    setSearchType('');
  };

  const value = {
    searchResults,
    searchQuery,
    searchType,
    isSearching,
    performSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};