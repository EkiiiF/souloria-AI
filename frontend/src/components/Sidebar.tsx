'use client';


import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FiHome, FiClock, FiInfo, FiHelpCircle, FiLogOut } from 'react-icons/fi';

// Ikon Close
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNavClick = () => {
    toggleSidebar(); // Tutup sidebar setelah link di-klik
  };

  return (
    <>
      {/* ... (kode overlay) ... */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* ... (sidebar-header) ... */}
        <nav className="sidebar-nav">
          <Link href="/" className="nav-item" onClick={handleNavClick}>
            <FiHome /> <span>Konsultasi</span>
          </Link>
          {/* <Link href="/history" className="nav-item" onClick={handleNavClick}>
            <FiClock /> <span>History</span>
          </Link> */}
          <Link href="/about" className="nav-item" onClick={handleNavClick}>
            <FiInfo /> <span>Tentang Souloria</span>
          </Link>
          <Link href="/bantuan-darurat" className="nav-item" onClick={handleNavClick}>
            <FiHelpCircle /> <span>Bantuan Darurat</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          {isLoading ? (
            <div className="user-profile loading">Memuat...</div>
          ) : user ? (
            <div className="user-profile">
              <span className="user-name" title={user?.email}>{user?.nama_pengguna}</span>
              <button onClick={handleLogout} className="logout-button" title="Logout">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <Link href="/login" className="nav-item login-cta">Login / Daftar</Link>
          )}
        </div>
      </aside>
    </>
  );
}