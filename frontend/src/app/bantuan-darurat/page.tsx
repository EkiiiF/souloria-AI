// frontend/src/app/bantuan-darurat/page.tsx
import Link from 'next/link';

export default function BantuanDaruratPage() {
  return (
    <>
      <main className="page-layout">
        <div className="page-container">
          <h1 className="page-title">Bantuan & Dukungan Profesional</h1>
          <p className="page-subtitle">
            Anda tidak sendirian. Jangan ragu untuk mencari bantuan jika Anda membutuhkannya.
          </p>
          
          <div className="disclaimer emergency-disclaimer">
            <strong>Penting:</strong> Jika Anda atau seseorang yang Anda kenal berada dalam krisis atau bahaya, segera hubungi layanan darurat di daerah Anda atau gunakan salah satu kontak di bawah ini. Souloria bukan layanan krisis.
          </div>

          <div className="resources-grid">
            <div className="resource-card hotline-card">
              <h2>Hotline Pencegahan Bunuh Diri</h2>
              <p>Layanan darurat untuk dukungan krisis emosional dan pencegahan bunuh diri.</p>
              <p className="contact-info">
                <strong>Kemenkes RI:</strong> Segera hubungi 119 (extension 8)
              </p>
              <p className="contact-info">
                <strong>LSM Into The Light:</strong> Kunjungi <a href="https://www.intothelightid.org/Layanan" target="_blank" rel="noopener noreferrer">intothelightid.org/Layanan</a> untuk daftar lengkap layanan.
              </p>
            </div>

            <div className="resource-card">
              <h2>Himpunan Psikologi Indonesia (HIMPSI)</h2>
              <p>Temukan psikolog profesional terverifikasi di seluruh wilayah Indonesia.</p>
              <a href="https://himpsi.or.id/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Kunjungi Website HIMPSI
              </a>
            </div>

            <div className="resource-card">
              <h2>Kalm</h2>
              <p>Platform konseling online dengan psikolog profesional melalui chat dan video call.</p>
              <a href="https://get-kalm.com/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Kunjungi Website Kalm
              </a>
            </div>
            
            <div className="resource-card">
              <h2>Satu Persen</h2>
              <p>Layanan edukasi dan konsultasi untuk pengembangan diri dan kesehatan mental.</p>
              <a href="https://satupersen.net/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Kunjungi Website Satu Persen
              </a>
            </div>
          </div>

          <Link href="/" className="back-link">
            &larr; Kembali ke Pencarian
          </Link>
        </div>
      </main>

      <footer className="site-footer">
        <div className="page-container">
          <p>&copy; {new Date().getFullYear()} Souloria. Semua Hak Cipta Dilindungi.</p>
          <nav>
            <Link href="/">Beranda</Link>
            <span>|</span>
            <Link href="/bantuan-darurat">Bantuan Darurat</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}