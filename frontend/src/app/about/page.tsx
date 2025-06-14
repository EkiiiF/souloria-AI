import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page-layout">
      <div className="page-container" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
        <h1 className="page-title">Tentang Souloria</h1>
        
        <p className="page-subtitle" style={{ textAlign: 'left', maxWidth: '800px' }}>
          Souloria adalah sebuah platform pencarian berbasis AI yang dirancang sebagai teman suportif dalam perjalanan kesehatan mental Anda. Di saat informasi terasa begitu melimpah dan membingungkan, kami hadir untuk memberikan jawaban yang jelas, empatik, dan relevan dengan apa yang Anda rasakan.
        </p>

        <div className="about-content">
          <h2>Misi Kami</h2>
          <p>
            Misi kami adalah mendestigmatisasi pencarian bantuan untuk kesehatan mental dan menyediakan ruang aman sebagai langkah pertama yang informatif. Kami percaya bahwa pemahaman adalah awal dari penyembuhan, dan Souloria dibangun untuk menjadi jembatan menuju pemahaman tersebut.
          </p>

          <h2>Fitur Utama</h2>
          <ul>
            <li><strong>Pencarian Berbasis AI:</strong> Ditenagai oleh Google Gemini, Souloria berusaha memahami intensi dan emosi di balik pertanyaan Anda untuk memberikan respons yang terasa seperti percakapan dengan teman yang peduli.</li>
            <li><strong>Sumber Terpercaya:</strong> Semua jawaban AI dibuat berdasarkan database artikel pilihan yang telah dikurasi dan ditinjau untuk memastikan kualitas dan keandalannya (Retrieval-Augmented Generation).</li>
            <li><strong>Antarmuka yang Tenang:</strong> Desain yang bersih dan minimalis untuk memberikan pengalaman yang menenangkan bagi pengguna.</li>
            <li><strong>Privasi Terjaga:</strong> Kami menghargai privasi Anda dalam setiap pencarian yang Anda lakukan. Riwayat percakapan hanya disimpan di browser Anda kecuali Anda memilih untuk login.</li>
          </ul>

          <div className="disclaimer">
            <strong>Disclaimer Penting:</strong> Souloria adalah alat bantu informasi dan dukungan emosional, <strong>bukan pengganti diagnosis atau saran medis dari profesional</strong>. Jika Anda merasa mengalami krisis atau membutuhkan bantuan serius, kami sangat mendorong Anda untuk segera menghubungi psikolog, psikiater, atau layanan kesehatan mental terdekat.
          </div>
        </div>

        <Link href="/" className="back-link">
          &larr; Kembali ke Konsultasi
        </Link>
      </div>
    </div>
  );
}