import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx'; 
import Footer from './components/layout/Footer.jsx'; 

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;