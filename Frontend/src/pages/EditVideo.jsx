import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api.js';
import './UploadVideo.css'; // We can reuse the same styles as the upload page

function EditVideo() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [oldThumbnail, setOldThumbnail] = useState('');
    
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the current video data to pre-fill the form
        API.get(`/videos/${videoId}`)
            .then(res => {
                const videoData = res.data.data[0];
                setTitle(videoData.title);
                setDescription(videoData.discription);
                setOldThumbnail(videoData.thumbnail);
            })
            .catch(err => setError("Failed to fetch video data."));
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('discription', description);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            await API.patch(`/videos/${videoId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Video updated successfully!');
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className='upload-container'>
            <div className='upload-form-wrapper'>
                <h2 className='upload-title'>Edit Video</h2>
                {error && <p className='error-message'>{error}</p>}
                <form onSubmit={handleSubmit} className='upload-form'>
                    <div className='input-group'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='description'>Description</label>
                        <textarea id='description' rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label>Current Thumbnail</label>
                        <img src={oldThumbnail} alt="Current Thumbnail" style={{width: '200px', borderRadius: '8px'}} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='thumbnail'>New Thumbnail (Optional)</label>
                        <input type='file' id='thumbnail' accept='image/*' onChange={(e) => setThumbnail(e.target.files[0])} />
                    </div>
                    <button type='submit' className='upload-btn-submit' disabled={updating}>
                        {updating ? 'Updating...' : 'Update Video'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditVideo;