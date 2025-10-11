import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import './Signup.css';

function Signup() {
    const navigate = useNavigate();
    
    // State for all form fields
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
    });
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handler for text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for file input changes
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'avatar') {
            setAvatar(files[0]);
        } else if (name === 'coverImage') {
            setCoverImage(files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Your backend requires an avatar, so we check for it here
        if (!formData.fullName || !formData.username || !formData.email || !formData.password || !avatar) {
            setError("All fields including avatar are required.");
            return;
        }

        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('avatar', avatar);
        if (coverImage) {
            data.append('coverImage', coverImage);
        }

        try {
            await API.post('/users/register', data);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='signup-page-container'>
            <div className='signup-form-wrapper'>
                <h2 className='signup-title'>Create Your OwnTube Account</h2>
                
                {error && <p className='error-message'>{error}</p>}
                
                <form onSubmit={handleSubmit} className='signup-form'>
                    <div className='input-group'>
                        <label htmlFor='fullName'>Full Name</label>
                        <input type='text' id='fullName' name='fullName' onChange={handleChange} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='username'>Username</label>
                        <input type='text' id='username' name='username' onChange={handleChange} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' name='email' onChange={handleChange} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' name='password' onChange={handleChange} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='avatar'>Avatar Image*</label>
                        <input className="file-input" type='file' id='avatar' name='avatar' accept='image/*' onChange={handleFileChange} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='coverImage'>Cover Image (Optional)</label>
                        <input className="file-input" type='file' id='coverImage' name='coverImage' accept='image/*' onChange={handleFileChange} />
                    </div>
                    <button type='submit' className='signup-btn-submit' disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="separator-line">OR</div>

                <a href="http://localhost:8000/api/v1/users/google" className='google-login-btn'>
                    <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_28dp.png" alt="Google icon" />
                    Sign up with Google
                </a>

                <p className='login-link-text'>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
