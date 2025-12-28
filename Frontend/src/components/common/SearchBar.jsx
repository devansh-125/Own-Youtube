import { useState } from 'react';
import { useSearch } from '../../context/SearchContext.jsx';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningText, setListeningText] = useState('');
  const { performSearch, isSearching, clearSearch } = useSearch();

  // Handle voice search
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onstart = () => {
      setIsListening(true);
      setListeningText('Listening...');
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript.trim()) {
        setQuery(transcript.trim());
        setListeningText('');
        performSearch(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setListeningText('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningText('');
    };

    recognition.lang = 'en-US';
    recognition.start();
  };

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

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  return (
    <div className='search-wrapper-container'>
      <div className='search-container'>
        <form className='search-wrapper-form' onSubmit={handleSearch}>
          <div className={`search-wrapper ${isFocused ? 'focused' : ''} ${isListening ? 'listening' : ''}`}>
            <svg 
              className='search-icon-left' 
              viewBox='0 0 24 24' 
              fill='none' 
              stroke='currentColor' 
              strokeWidth='2'
            >
              <circle cx='11' cy='11' r='8'></circle>
              <path d='m21 21-4.35-4.35'></path>
            </svg>

            <input
              type='text'
              placeholder='Search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='search-input'
              disabled={isSearching}
              autoComplete='off'
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            
            {listeningText && (
              <div className='listening-text'>
                {listeningText}
              </div>
            )}
            
            {query && !isSearching && !isListening && (
              <button
                type='button'
                className='clear-btn'
                onClick={handleClear}
                title='Clear search'
              >
                ✕
              </button>
            )}
            
            {isSearching && (
              <div className='search-spinner'>
                <div className='spinner'></div>
              </div>
            )}

            <button
              type='submit'
              disabled={isSearching || !query.trim()}
              className='search-btn'
              title='Search'
            >
              <svg 
                className='search-icon-right' 
                viewBox='0 0 24 24' 
                fill='none' 
                stroke='currentColor' 
                strokeWidth='2'
              >
                <circle cx='11' cy='11' r='8'></circle>
                <path d='m21 21-4.35-4.35'></path>
              </svg>
            </button>
          </div>
        </form>

        {/* Microphone Button */}
        <button
          type='button'
          className={`voice-search-btn ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceSearch}
          title='Search with your voice'
          disabled={isSearching}
        >
          <svg 
            className='mic-icon' 
            viewBox='0 0 24 24' 
            fill='currentColor'
          >
            <path d='M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z'/>
            <path d='M17 16.91c-1.48 1.46-3.51 2.36-5.77 2.36-2.26 0-4.29-.9-5.77-2.36M19 12h2c0 2.96-1.2 5.63-3.14 7.57M5 12H3c0 2.96 1.2 5.63 3.14 7.57'/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
