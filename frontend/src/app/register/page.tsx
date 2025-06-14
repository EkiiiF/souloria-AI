'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [namaPengguna, setNamaPengguna] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Cek jika password kurang dari 8 karakter
    if (password.length < 8) {
      setError('Password minimal harus 8 karakter.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_pengguna: namaPengguna,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Menangkap pesan error spesifik dari backend
        throw new Error(data.detail || 'Gagal mendaftar. Silakan coba lagi.');
      }
      
      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login...');
      
      // Kosongkan form setelah berhasil
      setNamaPengguna('');
      setEmail('');
      setPassword('');

      // Arahkan ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Wrapper untuk menengahkan konten di halaman
    <div className="page-wrapper">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">Buat Akun Souloria</h1>
        <p className="auth-subtitle">Mulai perjalanan Anda menuju ketenangan.</p>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <div className="input-group">
            <label htmlFor="nama">Nama Pengguna</label>
            <input
              id="nama"
              type="text"
              value={namaPengguna}
              onChange={(e) => setNamaPengguna(e.target.value)}
              required
              placeholder="Masukkan nama Anda"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh@email.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Minimal 8 karakter"
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Mendaftarkan...' : 'Buat Akun'}
          </button>
        </form>
        <p className="auth-switch">
          Sudah punya akun? <Link href="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}