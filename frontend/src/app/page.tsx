// 'use client';

// import { useState, FormEvent } from 'react';

// interface Source {
//   judul: string;
//   url: string;
//   sumber: string;
// }

// interface SearchResult {
//   response: string;
//   sources: Source[];
// }

// export default function Home() {
//   const [query, setQuery] = useState<string>('');
//   const [result, setResult] = useState<SearchResult | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

//   const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     setIsLoading(true);
//     setResult(null);
//     setError('');
//     setFeedbackSent(false); // Reset feedback saat cari baru

//     try {
//       const response = await fetch('http://127.0.0.1:8000/search', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query }),
//       });

//       if (!response.ok) {
//         throw new Error('Gagal mendapatkan respons dari server. Coba lagi nanti.');
//       }

//       const data: SearchResult = await response.json();
//       setResult(data);
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('Terjadi kesalahan yang tidak diketahui.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFeedback = async (isHelpful: boolean) => {
//     if (!result || feedbackSent) return;

//     try {
//       await fetch('http://127.0.0.1:8000/feedback', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: query,
//           response: result.response,
//           is_helpful: isHelpful,
//         }),
//       });
//       setFeedbackSent(true);
//     } catch (err) {
//       console.error('Gagal mengirim feedback:', err);
//     }
//   };

//   return (
//     <main className="main">
//       <div className="container">
//         <h1 className="title">
//           Souloria <span className="aiText">AI</span>
//         </h1>
//         <p className="subtitle">Temukan dukungan untuk kesehatan mental Anda.</p>

//         <form onSubmit={handleSearch} className="searchForm">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="searchInput"
//             placeholder="Bagaimana perasaanmu hari ini?"
//             disabled={isLoading}
//           />
//           <button type="submit" className="searchButton" disabled={isLoading}>
//             {isLoading ? 'Mencari...' : 'Tanya'}
//           </button>
//         </form>

//         {error && <p className="errorText">{error}</p>}
//         {isLoading && <div className="loader"></div>}

//         {result && (
//           <div className="resultsContainer">
//             <div className="aiResponse">
//               {result.response.split('\n').map((paragraph, index) => (
//                 <p key={index}>{paragraph}</p>
//               ))}
//             </div>

//             {result.sources && result.sources.length > 0 && (
//               <div className="sources">
//                 <h3>Sumber Artikel:</h3>
//                 <ul>
//                   {result.sources.map((source, index) => (
//                     <li key={index}>
//                       <a href={source.url} target="_blank" rel="noopener noreferrer">
//                         {source.judul}
//                       </a>
//                       <span> ({source.sumber})</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* BLOK FEEDBACK */}
//             <div className="feedbackSection">
//               {!feedbackSent ? (
//                 <>
//                   <p>Apakah jawaban ini membantu?</p>
//                   <button onClick={() => handleFeedback(true)} className="feedbackButton helpful">
//                     👍 Membantu
//                   </button>
//                   <button onClick={() => handleFeedback(false)} className="feedbackButton notHelpful">
//                     👎 Tidak Membantu
//                   </button>
//                 </>
//               ) : (
//                 <p className="feedbackThanks">Terima kasih atas masukan Anda!</p>
//               )}
//             </div>

//             <p className="disclaimer">
//               <strong>Penting:</strong> Souloria adalah asisten AI dan bukan pengganti nasihat medis profesional. Jika Anda merasa membutuhkan bantuan, jangan ragu untuk menghubungi psikolog atau psikiater.
//             </p>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';

// --- Tipe Data Baru untuk Struktur Chat ---
interface Source {
  judul: string;
  url: string;
  sumber: string;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  text: string;
  sources?: Source[];
}

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Efek untuk memuat riwayat dari localStorage saat pertama kali buka ---
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('souloriaChatHistory');
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Gagal memuat riwayat chat:", error);
      localStorage.removeItem('souloriaChatHistory');
    }
  }, []);

  // --- Efek untuk menyimpan riwayat ke localStorage setiap kali ada perubahan ---
  useEffect(() => {
    try {
        localStorage.setItem('souloriaChatHistory', JSON.stringify(chatHistory));
    } catch (error) {
        console.error("Gagal menyimpan riwayat chat:", error);
    }
  }, [chatHistory]);

  // --- Efek untuk auto-scroll ke pesan terbaru ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);


  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      text: query,
    };

    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan respons dari server.');
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: data.response,
        sources: data.sources,
      };
      setChatHistory(prev => [...prev, aiMessage]);

    } catch (err) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.',
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fungsi untuk menghapus riwayat ---
  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('souloriaChatHistory');
  };

  return (
    <main className="main-chat">
      <div className="chat-container">
        <header className="chat-header">
          <h1 className="title">Souloria <span className="aiText">AI</span></h1>
          <p className="subtitle">Teman AI Anda untuk kesehatan mental.</p>
          {chatHistory.length > 0 && (
            <button onClick={clearHistory} className="clear-button">
              Hapus Riwayat
            </button>
          )}
        </header>

        <div className="chat-history-container">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.type}-message`}>
              {msg.text.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {msg.type === 'ai' && msg.sources && msg.sources.length > 0 && (
                 <div className="sources">
                  <h3>Sumber Artikel:</h3>
                  <ul>
                    {msg.sources.map((source, index) => (
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
            </div>
          ))}

          {isLoading && (
            <div className="message-bubble ai-message">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <footer className="chat-footer">
          <form onSubmit={handleSearch} className="searchForm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="searchInput"
              placeholder="Tuliskan perasaan atau pertanyaan Anda..."
              disabled={isLoading}
            />
            <button type="submit" className="searchButton" disabled={isLoading}>
              Kirim
            </button>
          </form>
           <p className="disclaimer-chat">
            Souloria bukan pengganti saran medis profesional. <a href="/bantuan-darurat">Butuh bantuan segera?</a>
          </p>
        </footer>
      </div>
    </main>
  );
}