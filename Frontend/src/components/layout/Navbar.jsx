import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  
  // This is a placeholder. Later, this will come from your authentication context.
  const authStatus = false; 

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
  ];

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
          {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className='nav-button'
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}

          {authStatus && (
            <li>
              <button className='nav-button'>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;