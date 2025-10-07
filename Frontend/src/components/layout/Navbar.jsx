import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, authUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 1. Create an empty variable to hold our links
  let userLinks;

  // 2. Use a standard if/else block to determine which links to show
  if (isLoggedIn && authUser) {
    // If the user IS logged in, prepare the Logout and Avatar links
    userLinks = (
      <>
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
            <button className='search-btn'>🔍</button>
        </div>

        <ul className='nav-links'>
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