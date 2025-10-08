import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    return (
        <aside className='sidebar'>
            <ul className='sidebar-links'>
                <li>
                    <NavLink to="/" className='sidebar-link'>
                        <span className='icon'>🏠</span> Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/history" className='sidebar-link'>
                        <span className='icon'>📖</span> History
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/subscriptions" className='sidebar-link'>
                        <span className='icon'>👥</span> Subscriptions
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/liked-videos" className='sidebar-link'>
                        <span className='icon'>👍</span> Liked Videos
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;