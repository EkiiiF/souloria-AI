// 'use client';

// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import { jwtDecode } from 'jwt-decode'; // Kita butuh library ini, install nanti

// // Tipe untuk data pengguna yang kita dapat dari token
// interface User {
//   email: string;
//   // Tambahkan field lain jika ada, misal nama_pengguna
// }

// // Tipe untuk nilai yang akan disediakan oleh Context
// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (token: string) => void;
//   logout: () => void;
//   isLoading: boolean;
// }

// // Membuat Context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Membuat Provider Component
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true); // Loading state untuk cek token awal

//   useEffect(() => {
//     // Cek token di localStorage saat aplikasi pertama kali dimuat
//     try {
//       const storedToken = localStorage.getItem('souloria-token');
//       if (storedToken) {
//         const decoded = jwtDecode<User & { exp: number }>(storedToken);
//         // Cek apakah token sudah kedaluwarsa
//         if (decoded.exp * 1000 > Date.now()) {
//           setUser({ email: decoded.email });
//           setToken(storedToken);
//         } else {
//           // Token kedaluwarsa, hapus dari storage
//           localStorage.removeItem('souloria-token');
//         }
//       }
//     } catch (error) {
//         console.error("Invalid token found in localStorage", error);
//         localStorage.removeItem('souloria-token');
//     } finally {
//         setIsLoading(false);
//     }
//   }, []);

//   const login = (newToken: string) => {
//     try {
//       const decoded = jwtDecode<User>(newToken);
//       localStorage.setItem('souloria-token', newToken);
//       setUser({ email: decoded.email });
//       setToken(newToken);
//     } catch (error) {
//         console.error("Failed to decode token on login", error);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('souloria-token');
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom Hook untuk mempermudah penggunaan context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Tipe untuk data pengguna lengkap yang kita dapat dari endpoint /users/me
interface User {
  id: number;
  nama_pengguna: string;
  email: string;
  is_active: boolean;
}

// Tipe untuk nilai yang akan disediakan oleh Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean; // Untuk mengetahui status pengecekan token awal
}

// Membuat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Membuat Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk Logout
  const logout = () => {
    localStorage.removeItem('souloria-token');
    setUser(null);
    setToken(null);
  };

  // Fungsi baru untuk mengambil detail user dari backend menggunakan token
  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users/me/', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        // Jika token tidak valid (misalnya sudah kedaluwarsa), logout
        throw new Error('Sesi tidak valid atau telah berakhir.');
      }

      const userData: User = await response.json();
      setUser(userData);
      setToken(authToken);

    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      logout(); // Logout jika terjadi error
    }
  };
  
  // Fungsi untuk Login
  const login = (newToken: string) => {
    // Simpan token baru ke localStorage, lalu panggil fetchUser
    localStorage.setItem('souloria-token', newToken);
    fetchUser(newToken);
  };

  // Efek ini berjalan sekali saat aplikasi pertama kali dimuat
  useEffect(() => {
    const storedToken = localStorage.getItem('souloria-token');
    if (storedToken) {
      // Jika ada token, coba ambil data pengguna
      fetchUser(storedToken);
    }
    // Tandai bahwa proses pengecekan awal selesai
    setIsLoading(false);
  }, []);


  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {/* Jangan render anak komponen sebelum pengecekan awal selesai */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook untuk mempermudah penggunaan context di komponen lain
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};