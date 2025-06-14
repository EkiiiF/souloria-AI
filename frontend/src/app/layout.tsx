// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar"; // Impor Sidebar

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
        {/* AuthProvider HARUS membungkus semua elemen lain */}
        <AuthProvider>
          <div className="app-layout">
            <Sidebar />
            <main id="main-content">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}