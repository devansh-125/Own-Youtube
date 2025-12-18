import React from 'react';
import './ShareModal.css';

function ShareModal({ isOpen, onClose, videoTitle, videoUrl }) {
    if (!isOpen) return null;

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(videoTitle + ' ' + videoUrl)}`
        },
        {
            name: 'Facebook',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`
        },
        {
            name: 'X',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.svg',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(videoTitle)}&url=${encodeURIComponent(videoUrl)}`
        },
        {
            name: 'Email',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
            url: `mailto:?subject=${encodeURIComponent(videoTitle)}&body=${encodeURIComponent(videoUrl)}`
        }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(videoUrl);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="share-modal-overlay" onClick={onClose}>
            <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="share-modal-header">
                    <h3>Share</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="share-options-grid">
                    {shareOptions.map((option) => (
                        <a 
                            key={option.name} 
                            href={option.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="share-option"
                        >
                            <div className="share-icon-wrapper">
                                <img src={option.icon} alt={option.name} />
                            </div>
                            <span>{option.name}</span>
                        </a>
                    ))}
                </div>

                <div className="share-link-section">
                    <input type="text" readOnly value={videoUrl} />
                    <button onClick={handleCopy}>Copy</button>
                </div>
            </div>
        </div>
    );
}

export default ShareModal;
