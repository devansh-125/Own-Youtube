import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Icons = {
    Home: (
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="sidebar-icon">
            <g><path d="M4,10V21h6V15h4v6h6V10L12,3Z"></path></g>
        </svg>
    ),
    Shorts: (
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="sidebar-icon">
            <g><path d="M17.77,10.32l-1.2-.5L18,8.06a3.74,3.74,0,0,0-3.5-5.5,3.7,3.7,0,0,0-1.63.38L6,6.37a3.7,3.7,0,0,0-2.14,3.34,3.73,3.73,0,0,0,2.54,3.54l1.2.5L6,15.44a3.74,3.74,0,0,0,3.5,5.5,3.7,3.7,0,0,0,1.63-.38l6.87-3.43a3.7,3.7,0,0,0,2.14-3.34A3.73,3.73,0,0,0,17.77,10.32ZM10,14.5v-5l4.5,2.5Z"></path></g>
        </svg>
    ),
    Subscriptions: (
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="sidebar-icon">
            <g><path d="M18.7,8.7H5.3V7h13.4V8.7z M20.4,11.2H3.6v1.7h16.8V11.2z M22.1,13.7H1.9v1.7h20.2V13.7z M20.4,16.2H3.6v1.7h16.8V16.2z M12,2.2 L4.5,6h15L12,2.2z"></path></g>
        </svg>
    ),
    History: (
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="sidebar-icon">
            <g><path d="M14.97,16.95L12.96,14.94C12.67,14.65,12.5,14.25,12.5,13.82V8.5c0-0.55,0.45-1,1-1s1,0.45,1,1v4.91l1.88,1.88 c0.39,0.39,0.39,1.02,0,1.41C15.99,17.34,15.36,17.34,14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9c4.96,0,9-4.04,9-9 S16.96,3,12,3z M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2z"></path></g>
        </svg>
    ),
    Liked: (
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="sidebar-icon">
            <g><path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.13,0.24-1.53,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.97-0.74,2.19-1.77l1.34-6.33C21.2,11.71,20.13,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6.33 C18.53,20.02,18.01,20,17.43,20H8v-8.61l5.6-5.74C13.82,5.42,14.09,5.3,14.38,5.3c0.26,0,0.47,0.11,0.63,0.3 c0.16,0.19,0.21,0.45,0.15,0.66l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.26,0.91,0.69C19.78,12.91,19.89,13.03,19.98,13.17z"></path></g>
        </svg>
    )
};

function Sidebar({ mini = false }) {
    return (
        <aside className={`sidebar ${mini ? 'mini' : ''}`}>
            <ul className='sidebar-links'>
                <li>
                    <NavLink to="/" className='sidebar-link'>
                        <span className='icon'>{Icons.Home}</span> 
                        {!mini && <span className="link-text">Home</span>}
                        {mini && <span className="mini-text">Home</span>}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/shorts" className='sidebar-link'>
                        <span className='icon'>{Icons.Shorts}</span> 
                        {!mini && <span className="link-text">Shorts</span>}
                        {mini && <span className="mini-text">Shorts</span>}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/subscriptions" className='sidebar-link'>
                        <span className='icon'>{Icons.Subscriptions}</span> 
                        {!mini && <span className="link-text">Subscriptions</span>}
                        {mini && <span className="mini-text">Subs</span>}
                    </NavLink>
                </li>
                <hr className="sidebar-divider" />
                <li>
                    <NavLink to="/history" className='sidebar-link'>
                        <span className='icon'>{Icons.History}</span> 
                        {!mini && <span className="link-text">History</span>}
                        {mini && <span className="mini-text">History</span>}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/liked-videos" className='sidebar-link'>
                        <span className='icon'>{Icons.Liked}</span>
                        {!mini && <span className="link-text">Liked Videos</span>}
                        {mini && <span className="mini-text">Liked</span>}
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;