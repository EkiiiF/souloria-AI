'use client';

import { useState, FormEvent } from 'react';

interface Source {
  judul: string;
  url: string;
  sumber: string;
}

interface SearchResult {
  response: string;
  sources: Source[];
}

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError('');
    setFeedbackSent(false); // Reset feedback saat cari baru

    try {
      const response = await fetch('http://127.0.0.1:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan respons dari server. Coba lagi nanti.');
      }

      const data: SearchResult = await response.json();
      setResult(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (isHelpful: boolean) => {
    if (!result || feedbackSent) return;

    try {
      await fetch('http://127.0.0.1:8000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          response: result.response,
          is_helpful: isHelpful,
        }),
      });
      setFeedbackSent(true);
    } catch (err) {
      console.error('Gagal mengirim feedback:', err);
    }
  };

  return (
    <main className="main">
      <div className="container">
        <h1 className="title">
          Souloria <span className="aiText">AI</span>
        </h1>
        <p className="subtitle">Temukan dukungan untuk kesehatan mental Anda.</p>

        <form onSubmit={handleSearch} className="searchForm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="searchInput"
            placeholder="Bagaimana perasaanmu hari ini?"
            disabled={isLoading}
          />
          <button type="submit" className="searchButton" disabled={isLoading}>
            {isLoading ? 'Mencari...' : 'Tanya'}
          </button>
        </form>

        {error && <p className="errorText">{error}</p>}
        {isLoading && <div className="loader"></div>}

        {result && (
          <div className="resultsContainer">
            <div className="aiResponse">
              {result.response.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {result.sources && result.sources.length > 0 && (
              <div className="sources">
                <h3>Sumber Artikel:</h3>
                <ul>
                  {result.sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.judul}
                      </a>
                      <span> ({source.sumber})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* BLOK FEEDBACK */}
            <div className="feedbackSection">
              {!feedbackSent ? (
                <>
                  <p>Apakah jawaban ini membantu?</p>
                  <button onClick={() => handleFeedback(true)} className="feedbackButton helpful">
                    👍 Membantu
                  </button>
                  <button onClick={() => handleFeedback(false)} className="feedbackButton notHelpful">
                    👎 Tidak Membantu
                  </button>
                </>
              ) : (
                <p className="feedbackThanks">Terima kasih atas masukan Anda!</p>
              )}
            </div>

            <p className="disclaimer">
              <strong>Penting:</strong> Souloria adalah asisten AI dan bukan pengganti nasihat medis profesional. Jika Anda merasa membutuhkan bantuan, jangan ragu untuk menghubungi psikolog atau psikiater.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
