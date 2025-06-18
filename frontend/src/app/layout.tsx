import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "@/components/ClientLayout"; // Impor ClientLayout baru kita

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="id" className={inter.className}>
      <body>
        <AuthProvider>
          {/* ClientLayout sekarang berada TEPAT DI DALAM AuthProvider */}
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}