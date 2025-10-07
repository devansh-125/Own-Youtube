import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Import your page components
import Home from './pages/Home.jsx'
// import Login from './pages/Login.jsx'
// import Register from './pages/Register.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The App component is the layout
    children: [
      {
        path: '',
        element: <Home /> // Home page is the default child
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)