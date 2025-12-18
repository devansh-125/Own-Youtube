import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx' // 1. Import the provider
import { ThemeProvider } from './context/ThemeContext.jsx'

// Import your page components
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import History from './pages/History.jsx';
import VideoDetail from './pages/VideoDetail.jsx';
import Profile from './pages/Profile.jsx'
import UploadVideo from './pages/UploadVideo.jsx'
import EditVideo from './pages/EditVideo.jsx'
import LikedVideos from './pages/LikedVideos.jsx';
import Shorts from './pages/Shorts.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'history', element: <History /> },
      { path: 'video/:videoId', element: <VideoDetail /> },
      { path: 'profile', element: <Profile /> },
      { path: 'upload-video', element: <UploadVideo /> },
      { path : 'edit-video/:videoId', element: <EditVideo /> },
      { path: 'liked-videos', element: <LikedVideos /> },
      { path: 'shorts', element: <Shorts /> },
     
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
)