import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import './UploadVideo.css';

function UploadVideo() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !videoFile || !thumbnail) {
            setError('All fields are required.');
            return;
        }
        
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('discription', description); // Using your 'discription' spelling
        formData.append('videoFile', videoFile);
        formData.append('thumbnail', thumbnail);

        try {
            await API.post('/videos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Video uploaded successfully!');
            navigate('/profile'); // Redirect to profile page after upload
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
            setError(errorMessage);
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className='upload-container'>
            <div className='upload-form-wrapper'>
                <h2 className='upload-title'>Upload Your Video</h2>
                {error && <p className='error-message'>{error}</p>}
                <form onSubmit={handleSubmit} className='upload-form'>
                    <div className='input-group'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' id='title' onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='description'>Description</label>
                        <textarea id='description' rows="4" onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='thumbnail'>Thumbnail Image (JPEG, PNG)</label>
                        <input type='file' id='thumbnail' accept='image/jpeg, image/png' onChange={(e) => setThumbnail(e.target.files[0])} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='videoFile'>Video File (MP4)</label>
                        <input type='file' id='videoFile' accept='video/mp4' onChange={(e) => setVideoFile(e.target.files[0])} />
                    </div>
                    <button type='submit' className='upload-btn-submit' disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Publish'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UploadVideo;
