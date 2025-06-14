'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Gunakan custom hook kita

export default function Sidebar() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    // Mungkin arahkan ke halaman utama atau login
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Souloria</h2>
      </div>
      <nav className="sidebar-nav">
        <Link href="/" className="nav-item">Konsultasi Baru</Link>
        <Link href="/history" className="nav-item">History</Link>
        <Link href="/about" className="nav-item">Tentang Souloria</Link>
        <Link href="/bantuan-darurat" className="nav-item">Bantuan Darurat</Link>
      </nav>
      <div className="sidebar-footer">
        {isLoading ? (
          <div className="user-profile loading">Memuat...</div>
        ) : user ? (
        <div className="user-profile">
            <span className="user-name" title={user.email}>{user.nama_pengguna}</span>
            <button onClick={handleLogout} className="logout-button" title="Logout">🚪</button>
        </div>
        ) : (
          <Link href="/login" className="login-button">Login / Daftar</Link>
        )}
      </div>
    </aside>
  );
}