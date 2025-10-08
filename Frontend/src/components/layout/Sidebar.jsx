import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { set } from 'mongoose';
import { useAuth } from '../../context/AuthContext';


function Sidebar() {
    const { authUser } = useAuth();
    const currentUserId = authUser?._id;

    const handdleLikes = () => {
        if (!currentUserId) return alert("Please log in to view liked videos!");
        navigate('/liked-videos');
    }

   
 
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
                        <span className='icon'>👍</span>Liked Videos
                        
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;