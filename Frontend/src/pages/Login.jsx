import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import './Login.css';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');



    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!usernameOrEmail || !password) {
            setError("All fields are required.");
            return;
        }

        try {
            // Check if the input is an email or a username
            const isEmail = usernameOrEmail.includes('@');
            
            const loginData = {
                password: password
            };

            if (isEmail) {
                loginData.email = usernameOrEmail;
            } else {
                loginData.username = usernameOrEmail;
            }

            const response = await API.post('/users/login', loginData);
            console.log("Login successful:", response.data);

            if(response.data.data.foundUser){
              login(response.data.data.foundUser);
            }
            
            navigate('/'); 

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
            console.error("Login error:", err);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-form-wrapper'>
                <h2 className='login-title'>Log In to OwnTube</h2>
                
                {error && <p className='error-message'>{error}</p>}

                <form onSubmit={handleLogin} className='login-form'>
                    <div className='input-group'>
                        <label htmlFor='usernameOrEmail'>Email or Username</label>
                        <input
                            type='text' // <-- This is the fix for the input field
                            id='usernameOrEmail'
                            name='usernameOrEmail'
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <br />
                    <button type='submit' className='login-btn'>Log In</button>
                </form>
                <div className='divider'>
                    <span>OR</span>
                </div>

                <a href="http://localhost:8000/api/v1/users/google" className='google-login-btn'>
                    <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_28dp.png" alt="Google icon" />
                    Sign in with Google
                </a>

                <p className='signup-link'>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;