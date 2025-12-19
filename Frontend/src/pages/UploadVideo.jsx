import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import './UploadVideo.css';
import EmojiInput from '../components/common/EmojiInput.jsx';

function UploadVideo({ isShort = false }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Details, 2: Visibility

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!title || !videoFile || (!isShort && (!description || !thumbnail))) {
            setError('Please fill in all required fields.');
            setStep(1);
            return;
        }
        
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('discription', isShort ? (description || 'Short video') : description); 
        formData.append('videoFile', videoFile);
        formData.append('isShort', isShort);
        
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        console.log("Submitting upload - isShort:", isShort);
        console.log("Video file size:", (videoFile.size / (1024 * 1024)).toFixed(2) + " MB");
        console.log("FormData entries:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
        }

        try {
            await API.post('/videos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(isShort ? '/shorts' : '/profile');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
            setError(errorMessage);
            setStep(1);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'video') setVideoFile(file);
        else setThumbnail(file);
    };

    return (
        <div className='upload-page-overlay'>
            <div className='upload-modal'>
                <div className='upload-modal-header'>
                    <h2 className='modal-title'>{title || 'Upload video'}</h2>
                    <div className='header-actions'>
                        <span className='save-status'>Saved as private</span>
                        <button className='close-btn' onClick={() => navigate(-1)}>×</button>
                    </div>
                </div>

                <div className='upload-stepper'>
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className='step-dot'></div>
                        <span>Details</span>
                    </div>
                    <div className='step-line'></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className='step-dot'></div>
                        <span>Visibility</span>
                    </div>
                </div>

                <div className='upload-modal-content'>
                    {step === 1 ? (
                        <div className={`details-step ${isShort ? 'short-mode' : ''}`}>
                            <div className='details-left'>
                                <div className='input-section'>
                                    <label>Title (required)</label>
                                    <EmojiInput
                                        value={title}
                                        onChange={setTitle}
                                        placeholder={isShort ? "Add a title to your Short" : "Add a title that describes your video"}
                                        theme="dark"
                                        className="yt-input-wrapper"
                                    />
                                </div>

                                {!isShort && (
                                    <div className='input-section'>
                                        <label>Description</label>
                                        <EmojiInput
                                            as="textarea"
                                            value={description}
                                            onChange={setDescription}
                                            placeholder="Tell viewers about your video"
                                            theme="dark"
                                            className="yt-input-wrapper textarea"
                                        />
                                    </div>
                                )}

                                {!isShort && (
                                    <div className='thumbnail-section'>
                                        <label>Thumbnail</label>
                                        <p className='sub-label'>Select or upload a picture that shows what's in your video.</p>
                                        <div className='thumbnail-upload-box'>
                                            <input 
                                                type='file' 
                                                id='thumbnail' 
                                                accept='image/*' 
                                                onChange={(e) => handleFileChange(e, 'thumbnail')} 
                                                hidden
                                            />
                                            <label htmlFor='thumbnail' className='thumbnail-label'>
                                                {thumbnail ? (
                                                    <img src={URL.createObjectURL(thumbnail)} alt="Preview" className='thumb-preview' />
                                                ) : (
                                                    <div className='upload-placeholder'>
                                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                                        </svg>
                                                        <span>Upload thumbnail</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='details-right'>
                                <div className={`video-preview-card ${isShort ? 'short-preview' : ''}`}>
                                    <div className='preview-display'>
                                        {videoFile ? (
                                            <video src={URL.createObjectURL(videoFile)} className='preview-video' />
                                        ) : (
                                            <div className='preview-placeholder'>
                                                <span>{isShort ? 'Short preview will appear here' : 'Video preview will appear here'}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='preview-info'>
                                        <div className='info-row'>
                                            <span className='label'>Video link</span>
                                            <span className='link'>https://owntube.com/v/pending...</span>
                                        </div>
                                        <div className='info-row'>
                                            <span className='label'>Filename</span>
                                            <span className='filename'>{videoFile?.name || 'No file selected'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='file-upload-section'>
                                    <input 
                                        type='file' 
                                        id='videoFile' 
                                        accept='video/*' 
                                        onChange={(e) => handleFileChange(e, 'video')} 
                                        hidden
                                    />
                                    <label htmlFor='videoFile' className='yt-action-btn secondary full-width'>
                                        {videoFile ? 'Change Video' : (isShort ? 'Select Short (9:16)' : 'Select Video File')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='visibility-step'>
                            <h3>Visibility</h3>
                            <p>Choose when to publish and who can see your video</p>
                            <div className='visibility-options'>
                                <div className='option-card active'>
                                    <div className='option-radio'></div>
                                    <div className='option-text'>
                                        <h4>Save or publish</h4>
                                        <p>Make your video public, unlisted, or private</p>
                                        <div className='sub-options'>
                                            <label className='radio-label'>
                                                <input type="radio" name="visibility" defaultChecked />
                                                <span>Public</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='upload-modal-footer'>
                    <div className='upload-status'>
                        {uploading && <span className='status-text'>Uploading video...</span>}
                        {error && <span className='error-text'>{error}</span>}
                    </div>
                    <div className='footer-buttons'>
                        {step > 1 && (
                            <button className='yt-action-btn secondary' onClick={() => setStep(step - 1)}>
                                Back
                            </button>
                        )}
                        {step < 2 ? (
                            <button 
                                className='yt-action-btn primary' 
                                onClick={() => setStep(2)}
                                disabled={!videoFile || !title}
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                className='yt-action-btn primary' 
                                onClick={handleSubmit}
                                disabled={uploading}
                            >
                                {uploading ? 'Publishing...' : 'Publish'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadVideo;
