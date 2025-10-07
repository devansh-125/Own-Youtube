import React, { createContext, useContext, useState } from 'react';
import API from '../services/api.js'; // 1. Import your API client
import { useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state

    // 2. Add this useEffect hook
    useEffect(() => {
        // This function runs when the app first loads
        API.get('/users/current-user')
            .then(response => {
                if (response.data.data) {
                    setAuthUser(response.data.data);
                    setIsLoggedIn(true);
                }
            })
            .catch(error => {
                // If this fails, it just means the user is not logged in
                console.log("Auth check failed:", error);
            })
            .finally(() => {
                setLoading(false); // Stop loading once the check is complete
            });
    }, []);


    const login = (userData) => {
        setAuthUser(userData);
        setIsLoggedIn(true);
    };

    // 2. Update the logout function
    const logout = async () => {
        try {
            // Call the backend's logout endpoint
            await API.post('/users/logout');
            
            // Clear the frontend state
            setAuthUser(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Logout failed:", error);
            // We should still log out the user on the frontend even if the API call fails
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