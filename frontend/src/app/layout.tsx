// // // // frontend/src/app/layout.tsx
// // // import type { Metadata } from "next";
// // // import "./globals.css";
// // // import { AuthProvider } from "@/context/AuthContext";
// // // import Sidebar from "@/components/Sidebar"; // Impor Sidebar

// // // export const metadata: Metadata = {
// // //   title: "Souloria AI",
// // //   description: "Mesin pencari AI empatik untuk kesehatan mental",
// // // };

// // // export default function RootLayout({
// // //   children,
// // // }: Readonly<{
// // //   children: React.ReactNode;
// // // }>) {
// // //   return (
// // //     <html lang="id">
// // //       <body>
// // //         {/* AuthProvider HARUS membungkus semua elemen lain */}
// // //         <AuthProvider>
// // //           <div className="app-layout">
// // //             <Sidebar />
// // //             <main id="main-content">
// // //               {children}
// // //             </main>
// // //           </div>
// // //         </AuthProvider>
// // //       </body>
// // //     </html>
// // //   );
// // // }

// // // frontend/src/app/layout.tsx
// // 'use client'; // Tambahkan ini karena kita akan menggunakan state

// // import "./globals.css";
// // import { AuthProvider } from "@/context/AuthContext";
// // import Sidebar from "@/components/Sidebar";
// // import MobileHeader from "@/components/MobileHeader"; // Impor komponen baru
// // import { useState } from "react";
// // import type { Metadata } from "next";
// // import { Inter } from "next/font/google"; // Impor font

// // export const metadata: Metadata = {
// //   title: "Souloria AI",
// //   description: "Mesin pencari AI empatik untuk kesehatan mental",
// // };

// // const inter = Inter({ subsets: ["latin"] }); // Inisialisasi font

// // export default function RootLayout({
// //   children,
// // }: Readonly<{
// //   children: React.ReactNode;
// // }>) {
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// //   const toggleSidebar = () => {
// //     setIsSidebarOpen(!isSidebarOpen);
// //   };

// //   return (
// //     // Terapkan font ke seluruh halaman
// //     <html lang="id" className={inter.className}>
// //       <body>
// //         <AuthProvider>
// //           <div className="app-layout">
// //             <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
// //             <div className="main-content-wrapper">
// //               <MobileHeader onMenuClick={toggleSidebar} />
// //               <main id="main-content">
// //                 {children}
// //               </main>
// //             </div>
// //           </div>
// //         </AuthProvider>
// //       </body>
// //     </html>
// //   );
// // }

// // frontend/src/components/AppWrapper.tsx
// 'use client';

// import { useState, ReactNode } from "react";
// import Sidebar from "@/components/Sidebar";
// import MobileHeader from "@/components/MobileHeader";

// export default function AppWrapper({ children }: { children: ReactNode }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="app-layout">
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="main-content-wrapper">
//         <MobileHeader onMenuClick={toggleSidebar} />
//         <main id="main-content">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// frontend/src/app/layout.tsx

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