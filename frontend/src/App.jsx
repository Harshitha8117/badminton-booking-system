// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import BookingPage from './pages/BookingPage';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';

// global styles (app + admin)
import './styles/app.css';
import './styles/admin.css';

/*
  App shell with modern sticky header and route-aware nav buttons.
  - Booking        => '/'
  - BookingHistory => '/history'
  - AdminDashboard => '/admin'
*/

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    // root vs exact matching
    if (path === '/' && (location.pathname === '/' || location.pathname === '')) return true;
    return location.pathname === path;
  };

  return (
    <header className="app-header" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <h1 className="app-title" style={{ margin: 0 }}>Badminton Booking Platform</h1>
      </div>

      <nav className="nav-links" role="navigation" aria-label="Primary">
        <button
          className={`nav-btn ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          Booking
        </button>

        <button
          className={`nav-btn ${isActive('/history') ? 'active' : ''}`}
          onClick={() => navigate('/history')}
        >
          History
        </button>

        <button
          className={`nav-btn ${isActive('/admin') ? 'active' : ''}`}
          onClick={() => navigate('/admin')}
        >
          Admin
        </button>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* fallback: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
