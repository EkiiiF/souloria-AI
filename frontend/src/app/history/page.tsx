import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="page-layout">
      <div className="page-container">
        <h1 className="page-title">Riwayat Percakapan</h1>
        <p className="page-subtitle">
          Fitur riwayat percakapan yang tersimpan di akun Anda akan segera hadir!
          <br />
          Untuk saat ini, riwayat percakapan terakhir Anda masih bisa diakses di halaman utama.
        </p>
        <Link href="/" className="back-link">
          &larr; Kembali ke Konsultasi
        </Link>
      </div>
    </div>
  );
}