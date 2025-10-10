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
            // NOTE: You may need a separate logout for session vs JWT
            // For now, this just clears the frontend state.
            await API.post('/users/logout');
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            setAuthUser(null);
            setIsLoggedIn(false);
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