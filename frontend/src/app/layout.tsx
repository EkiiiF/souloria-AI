// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link"; // Impor komponen Link

export const metadata: Metadata = {
  title: "Souloria AI",
  description: "Mesin pencari AI empatik untuk kesehatan mental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
        {/* --- FOOTER BARU --- */}
        <footer className="site-footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Souloria. Semua Hak Cipta Dilindungi.</p>
            <nav>
              <Link href="/">Beranda</Link>
              <span>|</span>
              <Link href="/bantuan-darurat">Bantuan Darurat</Link>
            </nav>
          </div>
        </footer>
        {/* --- AKHIR FOOTER --- */}
      </body>
    </html>
  );
}