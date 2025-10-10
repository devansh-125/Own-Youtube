import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Step A: First, try to get the user via the session route (for Google)
                const sessionResponse = await API.get('/users/session/current-user');
                
                if (sessionResponse.data.data) {
                    setAuthUser(sessionResponse.data.data);
                    setIsLoggedIn(true);
                    return; // Found the user, so we stop here.
                }
            } catch (sessionError) {
                // This error is expected if the user is not logged in via a session.
                // So, we'll now try to get the user via the JWT route.
                try {
                    // Step B: If the session route fails, try the JWT route
                    const jwtResponse = await API.get('/users/current-user');

                    if (jwtResponse.data.data) {
                        setAuthUser(jwtResponse.data.data);
                        setIsLoggedIn(true);
                        return; // Found the user, so we stop here.
                    }
                } catch (jwtError) {
                    // If this also fails, the user is definitely not logged in.
                    console.log("No active session or valid JWT found.");
                    setAuthUser(null);
                    setIsLoggedIn(false);
                }
            }
        };

        checkAuthStatus();
    }, []);

    const login = (userData) => {
        setAuthUser(userData);
        setIsLoggedIn(true);
    }; 

    const logout = async () => {
        try {
            // 1. Determine authentication type
            const authType = localStorage.getItem('authType');

            // 2. End session in backend
            if (authType === 'google') {
                await API.get('/users/logout/google', { withCredentials: true });
            } else {
                await API.post('/users/logout', {}, { withCredentials: true });
            }

            // 3. Clean local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('authType');

            // 4. Reset global context
            setAuthUser(null);
            setIsLoggedIn(false);

            // 5. Redirect to login
            window.location.href = '/login';
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    const value = {
        authUser,
        isLoggedIn,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};