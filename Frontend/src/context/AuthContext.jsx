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
        // This runs once when the app loads to check if a user is already logged in
        API.get('/users/current-user')
            .then(response => {
                if (response.data.data) {
                    setAuthUser(response.data.data);
                    setIsLoggedIn(true);
                }
            })
            .catch(error => {
                // This error is expected if no one is logged in.
                console.log("No active session found.");
                setAuthUser(null);
                setIsLoggedIn(false);
            });
    }, []);

    const login = (userData) => {
        setAuthUser(userData);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        try {
            await API.post('/users/logout');
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            // Always clear the frontend state
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

    // THE FIX: This now ALWAYS renders your application.
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};