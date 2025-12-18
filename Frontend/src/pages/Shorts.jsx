import React from 'react';
import './Shorts.css';

function Shorts() {
    return (
        <div className="shorts-container">
            <div className="short-video-card">
                <div className="short-video-placeholder">
                    <div className="shorts-logo-large">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.77,10.32l-1.2-.5L18,8.06a3.74,3.74,0,0,0-3.5-5.5,3.7,3.7,0,0,0-1.63.38L6,6.37a3.7,3.7,0,0,0-2.14,3.34,3.73,3.73,0,0,0,2.54,3.54l1.2.5L6,15.44a3.74,3.74,0,0,0,3.5,5.5,3.7,3.7,0,0,0,1.63-.38l6.87-3.43a3.7,3.7,0,0,0,2.14-3.34A3.73,3.73,0,0,0,17.77,10.32ZM10,14.5v-5l4.5,2.5Z"></path>
                        </svg>
                    </div>
                    <h2>Shorts coming soon!</h2>
                    <p>We are working on bringing vertical short-form videos to OwnTube. Stay tuned!</p>
                </div>

                <div className="short-actions">
                    <button className="short-action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
                        </svg>
                        <span>Like</span>
                    </button>
                    <button className="short-action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L8.83 23l6.59-6.59c.37-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
                        </svg>
                        <span>Dislike</span>
                    </button>
                    <button className="short-action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z"></path>
                        </svg>
                        <span>Comments</span>
                    </button>
                    <button className="short-action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M15,5.63L20.66,12L15,18.37V14h-1c-3.96,0-7.14,2.4-8.4,6.12C6.12,15.33,9.76,12,14,12h1V5.63 M14,3v9c-4.97,0-9,4.03-9,9 c0-0.55,0.04-1.09,0.11-1.62C5.82,15.18,8.53,12,12,12h2v9l9-9L14,3L14,3z"></path>
                        </svg>
                        <span>Share</span>
                    </button>
                </div>

                <div className="short-info">
                    <div className="short-user">
                        <div className="short-avatar"></div>
                        <span className="short-username">@OwnTube</span>
                        <button className="nav-button" style={{ padding: '4px 12px', fontSize: '12px' }}>Subscribe</button>
                    </div>
                    <p className="short-title">Welcome to OwnTube Shorts! #shorts</p>
                </div>
            </div>
        </div>
    );
}

export default Shorts;
