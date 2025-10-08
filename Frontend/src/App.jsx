import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import './App.css'; 

function App() {
  return (
    <>
      <Navbar />
      <div className='app-container'> 
        <Sidebar />
        <main className='main-content'>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;