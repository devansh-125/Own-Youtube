import React, { useState, useRef } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import useOnClickOutside from '../../hooks/useOnClickOutside.js'; // Import the custom hook
import { useTheme } from '../../context/ThemeContext.jsx';
import './EmojiInput.css';

function EmojiInput({ value, onChange, placeholder, as = 'input', onFocus, actions, className }) {
    const [showPicker, setShowPicker] = useState(false);
    const { isDarkMode } = useTheme();
    
    // Create a ref to attach to the emoji picker's main container
    const pickerRef = useRef(null);

    // Use the custom hook: if a click happens outside the element with 'pickerRef',
    // the function to set showPicker to false will be called.
    useOnClickOutside(pickerRef, () => {
        if (showPicker) {
            setShowPicker(false);
        }
    });

    const onEmojiClick = (emojiData) => {
        console.log("Emoji clicked:", emojiData.emoji);
        const currentValue = value || '';
        const newText = currentValue + emojiData.emoji;
        onChange(newText);
    };

    // Conditionally render either an <input> or a <textarea>
    const InputComponent = as;

    const pickerTheme = isDarkMode ? Theme.DARK : Theme.LIGHT;

    return (
        <div className={`emoji-input-wrapper ${className || ''}`} ref={pickerRef}>
            <InputComponent
                className="text-input"
                placeholder={placeholder}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                rows={as === 'textarea' ? 1 : undefined}
            />
            
            <div className="emoji-controls">
                <button 
                    type="button" 
                    className="emoji-toggle-btn" 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPicker(prev => !prev);
                    }}
                >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                </button>

                {actions}
            </div>

            {showPicker && (
                <div className="picker-container">
                    <EmojiPicker 
                        onEmojiClick={onEmojiClick} 
                        theme={pickerTheme}
                        searchPlaceholder="Search emoji"
                        width="350px"
                        height="400px"
                        skinTonesDisabled
                        previewConfig={{ showPreview: false }}
                        lazyLoadEmojis={true}
                    />
                </div>
            )}
        </div>
    );
}

export default EmojiInput;

