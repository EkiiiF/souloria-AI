// frontend/src/components/ClientLayout.tsx
'use client';

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";

// Ikon Hamburger kita letakkan di sini agar rapi
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MobileHeader = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="mobile-header">
      <button
        onClick={onMenuClick}
        className="hamburger-button"
        title="Open menu"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>
      <h1 className="mobile-title">Souloria</h1>
    </header>
  );
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      {/* Sidebar dan state-nya dikelola di sini */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content-wrapper">
        {/* Header mobile juga dikelola di sini */}
        <MobileHeader onMenuClick={toggleSidebar} />
        <main id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}