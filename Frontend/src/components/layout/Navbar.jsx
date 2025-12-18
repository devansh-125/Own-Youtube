import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import useOnClickOutside from '../../hooks/useOnClickOutside.js';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, authUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const createMenuRef = useRef(null);

  useOnClickOutside(createMenuRef, () => setIsCreateMenuOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateOption = (path) => {
    setIsCreateMenuOpen(false);
    navigate(path);
  };

  // 1. Create an empty variable to hold our links
  let userLinks;

  // 2. Use a standard if/else block to determine which links to show
  if (isLoggedIn && authUser) {
    // If the user IS logged in, prepare the Logout and Avatar links
    userLinks = (
      <>
        <li className="create-container" ref={createMenuRef}>
          <button 
            className='create-btn' 
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            title="Create"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '24px', height: '24px'}}>
              <path d="M14,13h-3v3H9v-3H6v-2h3V8h2v3h3V13z M17,6H3v12h14v-6.39l4,3.83V8.56l-4,3.83V6z M18,5v14H2V5H18L18,5z"></path>
            </svg>
          </button>
          {isCreateMenuOpen && (
            <div className="create-dropdown">
              <button onClick={() => handleCreateOption('/upload-video')} className="create-item">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17,10.5V7c0-0.55-0.45-1-1-1H4C3.45,6,3,6.45,3,7v10c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1v-3.5l4,4v-11L17,10.5z M14,13h-3v3H9v-3H6v-2h3V8h2v3h3V13z"></path></svg>
                Upload video
              </button>
              <button onClick={() => handleCreateOption('/upload-short')} className="create-item">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.77,10.32l-1.2-.5L18,8.06a3.74,3.74,0,0,0-3.5-5.5,3.7,3.7,0,0,0-1.63.38L6,6.37a3.7,3.7,0,0,0-2.14,3.34,3.73,3.73,0,0,0,2.54,3.54l1.2.5L6,15.44a3.74,3.74,0,0,0,3.5,5.5,3.7,3.7,0,0,0,1.63-.38l6.87-3.43a3.7,3.7,0,0,0,2.14-3.34A3.73,3.73,0,0,0,17.77,10.32ZM10,14.5v-5l4.5,2.5Z"></path></svg>
                Create Short
              </button>
              <button onClick={() => handleCreateOption('/live')} className="create-item">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2z M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5 S14.76,17,12,17z M12,9c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3S13.66,9,12,9z"></path></svg>
                Go live
              </button>
              <button onClick={() => handleCreateOption('/post')} className="create-item">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.11,3,19,3z M19,19H5V5h14V19z M17,12h-4v4h-2v-4H7v-2h4V6h2v4h4V12z"></path></svg>
                Create post
              </button>
            </div>
          )}
        </li>
        <li>
          <button onClick={handleLogout} className='nav-button'>Logout</button>
        </li>
        <li>
          <Link to={`/profile`}>
            <img 
              src={authUser.avatar} 
              alt={authUser.username} 
              className='nav-avatar' 
            />
          </Link>
        </li>
      </>
    );
  } else {
    // If the user is NOT logged in, prepare the Login and Signup links
    userLinks = (
      <>
        <li>
          <button onClick={() => navigate('/login')} className='nav-button'>Login</button>
        </li>
        <li>
          <button onClick={() => navigate('/signup')} className='nav-button'>Signup</button>
        </li>
      </>
    );
  }

  return (
    <header className='navbar'>
      <nav className='nav-container'>
        
        <div className='logo-container'>
          <Link to='/' className='logo-link'>
            <span className='logo-text'>OwnTube</span>
          </Link>
        </div>

        <div className='search-container'>
            <input
              type="text"
              placeholder="Search"
              className='search-input'
            />
            <button className='search-btn'>
              <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style={{width: '24px', height: '24px', fill: 'var(--text-color)'}}>
                <g><path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path></g>
              </svg>
            </button>
        </div>

        <ul className='nav-links'>
          <li>
            <button onClick={toggleTheme} className='theme-toggle-btn' title="Toggle Theme">
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '24px', height: '24px'}}>
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 00-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 00-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '24px', height: '24px'}}>
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path>
                </svg>
              )}
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/')} className='nav-button'>Home</button>
          </li>
          {/* 3. Render the variable that now holds the correct links */}
          {userLinks}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;