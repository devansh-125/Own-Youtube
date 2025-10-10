import React, { useState, useRef } from 'react';
import Picker from 'emoji-picker-react';
import useOnClickOutside from '../../hooks/useOnClickOutside.js'; // Import the custom hook
import './EmojiInput.css';

function EmojiInput({ value, onChange, placeholder, as = 'input', theme = 'dark' }) {
    const [showPicker, setShowPicker] = useState(false);
    
    // Create a ref to attach to the emoji picker's main container
    const pickerRef = useRef(null);

    // Use the custom hook: if a click happens outside the element with 'pickerRef',
    // the function to set showPicker to false will be called.
    useOnClickOutside(pickerRef, () => setShowPicker(false));

    const onEmojiClick = (emojiObject) => {
        const currentValue = value || '';
        const newText = currentValue + emojiObject.emoji;
        onChange(newText);
        // We no longer close the picker here, allowing for multiple selections.
    };

    // Conditionally render either an <input> or a <textarea>
    const InputComponent = as;

    return (
        <div className="emoji-input-wrapper">
            <InputComponent
                className="text-input"
                placeholder={placeholder}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                rows={as === 'textarea' ? 1 : undefined}
            />
            
            <button 
                type="button" 
                className="emoji-toggle-btn" 
                onClick={() => setShowPicker(val => !val)}
            >
                😊
            </button>

            {/* The emoji picker is only rendered when showPicker is true */}
            {/* We attach the ref here so the hook knows which element to watch */}
            {showPicker && (
                <div className="picker-container" ref={pickerRef}>
                    <Picker onEmojiClick={onEmojiClick} theme={theme} />
                </div>
            )}
        </div>
    );
}

export default EmojiInput;

