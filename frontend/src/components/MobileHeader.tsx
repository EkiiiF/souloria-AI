// frontend/src/components/MobileHeader.tsx
'use client';

// Ikon Hamburger
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
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
}