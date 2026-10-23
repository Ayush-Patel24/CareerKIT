import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
