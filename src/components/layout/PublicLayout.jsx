import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <>
      <AppNavbar />
      <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 300px)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
