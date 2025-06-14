// // 'use client';

// // import { useState, FormEvent } from 'react';

// // interface Source {
// //   judul: string;
// //   url: string;
// //   sumber: string;
// // }

// // interface SearchResult {
// //   response: string;
// //   sources: Source[];
// // }

// // export default function Home() {
// //   const [query, setQuery] = useState<string>('');
// //   const [result, setResult] = useState<SearchResult | null>(null);
// //   const [isLoading, setIsLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string>('');
// //   const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

// //   const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     if (!query.trim()) return;

// //     setIsLoading(true);
// //     setResult(null);
// //     setError('');
// //     setFeedbackSent(false); // Reset feedback saat cari baru

// //     try {
// //       const response = await fetch('http://127.0.0.1:8000/search', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ query }),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Gagal mendapatkan respons dari server. Coba lagi nanti.');
// //       }

// //       const data: SearchResult = await response.json();
// //       setResult(data);
// //     } catch (err) {
// //       if (err instanceof Error) {
// //         setError(err.message);
// //       } else {
// //         setError('Terjadi kesalahan yang tidak diketahui.');
// //       }
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleFeedback = async (isHelpful: boolean) => {
// //     if (!result || feedbackSent) return;

// //     try {
// //       await fetch('http://127.0.0.1:8000/feedback', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           query: query,
// //           response: result.response,
// //           is_helpful: isHelpful,
// //         }),
// //       });
// //       setFeedbackSent(true);
// //     } catch (err) {
// //       console.error('Gagal mengirim feedback:', err);
// //     }
// //   };

// //   return (
// //     <main className="main">
// //       <div className="container">
// //         <h1 className="title">
// //           Souloria <span className="aiText">AI</span>
// //         </h1>
// //         <p className="subtitle">Temukan dukungan untuk kesehatan mental Anda.</p>

// //         <form onSubmit={handleSearch} className="searchForm">
// //           <input
// //             type="text"
// //             value={query}
// //             onChange={(e) => setQuery(e.target.value)}
// //             className="searchInput"
// //             placeholder="Bagaimana perasaanmu hari ini?"
// //             disabled={isLoading}
// //           />
// //           <button type="submit" className="searchButton" disabled={isLoading}>
// //             {isLoading ? 'Mencari...' : 'Tanya'}
// //           </button>
// //         </form>

// //         {error && <p className="errorText">{error}</p>}
// //         {isLoading && <div className="loader"></div>}

// //         {result && (
// //           <div className="resultsContainer">
// //             <div className="aiResponse">
// //               {result.response.split('\n').map((paragraph, index) => (
// //                 <p key={index}>{paragraph}</p>
// //               ))}
// //             </div>

// //             {result.sources && result.sources.length > 0 && (
// //               <div className="sources">
// //                 <h3>Sumber Artikel:</h3>
// //                 <ul>
// //                   {result.sources.map((source, index) => (
// //                     <li key={index}>
// //                       <a href={source.url} target="_blank" rel="noopener noreferrer">
// //                         {source.judul}
// //                       </a>
// //                       <span> ({source.sumber})</span>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}

// //             {/* BLOK FEEDBACK */}
// //             <div className="feedbackSection">
// //               {!feedbackSent ? (
// //                 <>
// //                   <p>Apakah jawaban ini membantu?</p>
// //                   <button onClick={() => handleFeedback(true)} className="feedbackButton helpful">
// //                     👍 Membantu
// //                   </button>
// //                   <button onClick={() => handleFeedback(false)} className="feedbackButton notHelpful">
// //                     👎 Tidak Membantu
// //                   </button>
// //                 </>
// //               ) : (
// //                 <p className="feedbackThanks">Terima kasih atas masukan Anda!</p>
// //               )}
// //             </div>

// //             <p className="disclaimer">
// //               <strong>Penting:</strong> Souloria adalah asisten AI dan bukan pengganti nasihat medis profesional. Jika Anda merasa membutuhkan bantuan, jangan ragu untuk menghubungi psikolog atau psikiater.
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </main>
// //   );
// // }

// // 'use client';

// // import { useState, FormEvent, useEffect, useRef } from 'react';
// // import { useAuth } from '@/context/AuthContext';

// // // --- Tipe Data Baru untuk Struktur Chat ---
// // interface Source {
// //   judul: string;
// //   url: string;
// //   sumber: string;
// // }

// // interface ChatMessage {
// //   id: number;
// //   type: 'user' | 'ai';
// //   text: string;
// //   sources?: Source[];
// // }

// // export default function Home() {
// //   const [query, setQuery] = useState<string>('');
// //   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
// //   const [isLoading, setIsLoading] = useState<boolean>(false);
// //   const chatEndRef = useRef<HTMLDivElement>(null);

// //   // --- Efek untuk memuat riwayat dari localStorage saat pertama kali buka ---
// //   useEffect(() => {
// //     try {
// //       const savedHistory = localStorage.getItem('souloriaChatHistory');
// //       if (savedHistory) {
// //         setChatHistory(JSON.parse(savedHistory));
// //       }
// //     } catch (error) {
// //       console.error("Gagal memuat riwayat chat:", error);
// //       localStorage.removeItem('souloriaChatHistory');
// //     }
// //   }, []);

// //   // --- Efek untuk menyimpan riwayat ke localStorage setiap kali ada perubahan ---
// //   useEffect(() => {
// //     try {
// //         localStorage.setItem('souloriaChatHistory', JSON.stringify(chatHistory));
// //     } catch (error) {
// //         console.error("Gagal menyimpan riwayat chat:", error);
// //     }
// //   }, [chatHistory]);

// //   // --- Efek untuk auto-scroll ke pesan terbaru ---
// //   useEffect(() => {
// //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [chatHistory, isLoading]);


// //   const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     if (!query.trim() || isLoading) return;

// //     const userMessage: ChatMessage = {
// //       id: Date.now(),
// //       type: 'user',
// //       text: query,
// //     };

// //     setChatHistory(prev => [...prev, userMessage]);
// //     setQuery('');
// //     setIsLoading(true);

// //     try {
// //       const response = await fetch('http://127.0.0.1:8000/search', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ query }),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Gagal mendapatkan respons dari server.');
// //       }

// //       const data = await response.json();
      
// //       const aiMessage: ChatMessage = {
// //         id: Date.now() + 1,
// //         type: 'ai',
// //         text: data.response,
// //         sources: data.sources,
// //       };
// //       setChatHistory(prev => [...prev, aiMessage]);

// //     } catch (err) {
// //       const errorMessage: ChatMessage = {
// //         id: Date.now() + 1,
// //         type: 'ai',
// //         text: err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.',
// //       };
// //       setChatHistory(prev => [...prev, errorMessage]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // --- Fungsi untuk menghapus riwayat ---
// //   const clearHistory = () => {
// //     setChatHistory([]);
// //     localStorage.removeItem('souloriaChatHistory');
// //   };

// //   return (
// //     <main className="main-chat">
// //       <div className="chat-container">
// //         {/* <header className="chat-header">
// //           <h1 className="title">Souloria <span className="aiText">AI</span></h1>
// //           <p className="subtitle">Teman AI Anda untuk kesehatan mental.</p>
// //           {chatHistory.length > 0 && (
// //             <button onClick={clearHistory} className="clear-button">
// //               Hapus Riwayat
// //             </button>
// //           )}
// //         </header> */}
// //         <header className="chat-header">
// //     <h1 className="title">Konsultasi Baru</h1>
// //     {user ? <p className="subtitle">Hai, {user.nama_pengguna}! Apa yang bisa dibantu?</p> : <p className="subtitle">Silakan ajukan pertanyaan Anda.</p> }
// //     {/* ... tombol clear history ... */}
// // </header>

// //         <div className="chat-history-container">
// //           {chatHistory.map((msg) => (
// //             <div key={msg.id} className={`message-bubble ${msg.type}-message`}>
// //               {msg.text.split('\n').map((paragraph, index) => (
// //                 <p key={index}>{paragraph}</p>
// //               ))}
// //               {msg.type === 'ai' && msg.sources && msg.sources.length > 0 && (
// //                  <div className="sources">
// //                   <h3>Sumber Artikel:</h3>
// //                   <ul>
// //                     {msg.sources.map((source, index) => (
// //                       <li key={index}>
// //                         <a href={source.url} target="_blank" rel="noopener noreferrer">
// //                           {source.judul}
// //                         </a>
// //                         <span> ({source.sumber})</span>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </div>
// //               )}
// //             </div>
// //           ))}

// //           {isLoading && (
// //             <div className="message-bubble ai-message">
// //               <div className="typing-indicator">
// //                 <span></span><span></span><span></span>
// //               </div>
// //             </div>
// //           )}
// //           <div ref={chatEndRef} />
// //         </div>

// //         <footer className="chat-footer">
// //           <form onSubmit={handleSearch} className="searchForm">
// //             <input
// //               type="text"
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               className="searchInput"
// //               placeholder="Tuliskan perasaan atau pertanyaan Anda..."
// //               disabled={isLoading}
// //             />
// //             <button type="submit" className="searchButton" disabled={isLoading}>
// //               Kirim
// //             </button>
// //           </form>
// //            <p className="disclaimer-chat">
// //             Souloria bukan pengganti saran medis profesional. <a href="/bantuan-darurat">Butuh bantuan segera?</a>
// //           </p>
// //         </footer>
// //       </div>
// //     </main>
// //   );
// // }

// 'use client';

// import { useState, FormEvent, useEffect, useRef } from 'react';
// import { useAuth } from '@/context/AuthContext';

// // Tipe data untuk sumber artikel
// interface Source {
//   judul: string;
//   url: string;
//   sumber: string;
// }

// // Tipe data untuk setiap pesan dalam chat
// interface ChatMessage {
//   id: number;
//   type: 'user' | 'ai';
//   text: string;
//   sources?: Source[];
// }

// export default function ChatPage() {
//   // Mengambil status pengguna dari AuthContext
//   const { user } = useAuth();

//   // State untuk mengelola komponen
//   const [query, setQuery] = useState<string>('');
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [feedbackGiven, setFeedbackGiven] = useState<{[messageId: number]: boolean}>({});
  
//   // Ref untuk auto-scroll
//   const chatEndRef = useRef<HTMLDivElement>(null);

//   // Efek untuk memuat riwayat dari localStorage saat komponen pertama kali dimuat
//   useEffect(() => {
//     try {
//       const savedHistory = localStorage.getItem('souloriaChatHistory');
//       if (savedHistory) {
//         setChatHistory(JSON.parse(savedHistory));
//       }
//     } catch (error) {
//       console.error("Gagal memuat riwayat chat:", error);
//     }
//   }, []);

//   // Efek untuk menyimpan riwayat ke localStorage setiap kali ada pesan baru
//   useEffect(() => {
//     try {
//       localStorage.setItem('souloriaChatHistory', JSON.stringify(chatHistory));
//     } catch (error) {
//       console.error("Gagal menyimpan riwayat chat:", error);
//     }
//   }, [chatHistory]);

//   // Efek untuk auto-scroll ke pesan terbaru
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatHistory, isLoading]);


//   const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!query.trim() || isLoading) return;

//     const currentQuery = query;
//     const userMessage: ChatMessage = { id: Date.now(), type: 'user', text: currentQuery };

//     setChatHistory(prev => [...prev, userMessage]);
//     setQuery('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://127.0.0.1:8000/search', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query: currentQuery }),
//       });

//       if (!response.ok) {
//         throw new Error('Gagal mendapatkan respons dari server.');
//       }

//       const data = await response.json();
//       const aiMessage: ChatMessage = { id: Date.now() + 1, type: 'ai', text: data.response, sources: data.sources };
//       setChatHistory(prev => [...prev, aiMessage]);

//     } catch (err) {
//       const errorText = err instanceof Error ? err.message : 'Terjadi kesalahan.';
//       const errorMessage: ChatMessage = { id: Date.now() + 1, type: 'ai', text: errorText };
//       setChatHistory(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFeedback = async (message: ChatMessage, isHelpful: boolean) => {
//     if (feedbackGiven[message.id]) return;

//     try {
//       const userMessageQuery = [...chatHistory].reverse().find(m => m.id < message.id && m.type === 'user')?.text || 'N/A';
      
//       await fetch('http://127.0.0.1:8000/feedback', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: userMessageQuery,
//           response: message.text,
//           is_helpful: isHelpful,
//         }),
//       });
//       setFeedbackGiven(prev => ({ ...prev, [message.id]: true }));
//     } catch (err) {
//       console.error("Gagal mengirim feedback:", err);
//     }
//   };

//   const clearHistory = () => {
//     setChatHistory([]);
//     setFeedbackGiven({});
//   };

//   // Membuat sapaan dinamis berdasarkan status login
//   const greeting = user ? `Hai, ${user.nama_pengguna}! Apa yang bisa dibantu?` : "Silakan ajukan pertanyaan Anda.";

//   return (
//     <div className="chat-container">
//       <header className="chat-header">
//         <h1 className="title">Konsultasi Baru</h1>
//         <p className="subtitle">{greeting}</p>
//         {chatHistory.length > 0 && (
//           <button onClick={clearHistory} className="clear-button">Hapus</button>
//         )}
//       </header>

//       <div className="chat-history-container">
//         {chatHistory.map((msg) => (
//           <div key={msg.id} className={`message-bubble ${msg.type}-message`}>
//             {msg.text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            
//             {msg.type === 'ai' && msg.sources && msg.sources.length > 0 && (
//               <div className="sources">
//                 <h3>Sumber Artikel:</h3>
//                 <ul>
//                   {msg.sources.map((source, index) => (
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
            
//             {msg.type === 'ai' && (
//               <div className="feedbackSection">
//                 {!feedbackGiven[msg.id] ? (
//                   <>
//                     <button onClick={() => handleFeedback(msg, true)} className="feedbackButton" title="Membantu">👍</button>
//                     <button onClick={() => handleFeedback(msg, false)} className="feedbackButton" title="Tidak Membantu">👎</button>
//                   </>
//                 ) : (
//                   <p className="feedbackThanks">✓ Terima kasih</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}

//         {isLoading && (
//           <div className="message-bubble ai-message">
//             <div className="typing-indicator"><span></span><span></span><span></span></div>
//           </div>
//         )}
//         <div ref={chatEndRef} />
//       </div>

//       <footer className="chat-footer">
//         <form onSubmit={handleSearch} className="searchForm">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="searchInput"
//             placeholder="Tuliskan perasaan atau pertanyaan Anda..."
//             disabled={isLoading}
//           />
//           <button type="submit" className="searchButton" disabled={isLoading}>Kirim</button>
//         </form>
//         <p className="disclaimer-chat">
//           Souloria bukan pengganti saran medis profesional. <a href="/bantuan-darurat">Butuh bantuan segera?</a>
//         </p>
//       </footer>
//     </div>
//   );
// }

// 'use client';

// import { useState, FormEvent, useEffect, useRef } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';

// // Tipe data untuk sumber artikel dari API
// interface Source {
//   judul: string;
//   url: string;
//   sumber: string;
// }

// // Tipe data untuk pesan di UI
// interface ChatMessage {
//   id: number;
//   role: 'user' | 'ai';
//   content: string;
//   sources?: Source[];
// }

// export default function ChatPage() {
//   const { user, token } = useAuth();
//   const [query, setQuery] = useState('');
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [feedbackGiven, setFeedbackGiven] = useState<{ [messageId: number]: boolean }>({});
//   const chatEndRef = useRef<HTMLDivElement>(null);

//   // Efek untuk memuat riwayat chat
//   useEffect(() => {
//     // Logika untuk memuat riwayat (dari localStorage atau API)
//     // ... (kode dari jawaban sebelumnya sudah benar)
//   }, [user, token]);

//   // Efek untuk auto-scroll
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatHistory, isLoading]);

//   const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!query.trim() || isLoading) return;

//     const currentQuery = query;
//     const userMessage: ChatMessage = { id: Date.now(), role: 'user', content: currentQuery };
    
//     setChatHistory(prev => [...prev, userMessage]);
//     setQuery('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://127.0.0.1:8000/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` })
//         },
//         body: JSON.stringify({ query: currentQuery }),
//       });

//       if (!response.ok) throw new Error('Gagal mendapatkan respons dari server.');

//       const data = await response.json();
//       const aiMessage: ChatMessage = { id: Date.now() + 1, role: 'ai', content: data.response, sources: data.sources };
      
//       setChatHistory(prev => [...prev, aiMessage]);
//     } catch (err) {
//       const errorText = err instanceof Error ? err.message : 'Terjadi kesalahan.';
//       const errorMessage: ChatMessage = { id: Date.now() + 1, role: 'ai', content: errorText };
//       setChatHistory(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const clearHistory = () => {
//     setChatHistory([]);
//     setFeedbackGiven({});
//     if (!user) {
//         localStorage.removeItem('souloriaGuestHistory');
//     }
//   };

//   const greeting = user ? `Hai, ${user.nama_pengguna}! Apa yang bisa dibantu?` : "Silakan ajukan pertanyaan Anda.";

//   // --- BAGIAN INI YANG PERLU DIPASTIKAN LENGKAP ---
//   return (
//     <div className="chat-container">
//       <header className="chat-header">
//         <h1 className="title">Konsultasi Baru</h1>
//         <p className="subtitle">{greeting}</p>
//         {chatHistory.length > 0 && (
//           <button onClick={clearHistory} className="clear-button">Hapus</button>
//         )}
//       </header>

//       <div className="chat-history-container">
//         {/* ... (logika mapping chatHistory tetap sama) ... */}
//         {chatHistory.map((msg, index) => (
//           <div key={`${msg.id}-${index}`} className={`message-bubble ${msg.role}-message`}>
//             <p>{msg.content}</p>
//           </div>
//         ))}
//         {isLoading && (
//             <div className="message-bubble ai-message">
//               <div className="typing-indicator"><span></span><span></span><span></span></div>
//             </div>
//         )}
//         <div ref={chatEndRef} />
//       </div>

//       {/* --- BAGIAN YANG HILANG ADA DI SINI --- */}
//       <footer className="chat-footer">
//         <form onSubmit={handleSearch} className="searchForm">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="searchInput"
//             placeholder="Tuliskan perasaan atau pertanyaan Anda..."
//             disabled={isLoading}
//           />
//           <button type="submit" className="searchButton" disabled={isLoading}>Kirim</button>
//         </form>
//         <p className="disclaimer-chat">
//           Souloria bukan pengganti saran medis profesional. <Link href="/bantuan-darurat">Butuh bantuan segera?</Link>
//         </p>
//       </footer>
//     </div>
//   );
// }

'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Tipe data untuk sumber artikel dari API
interface Source {
  judul: string;
  url: string;
  sumber: string;
}

// Tipe data untuk pesan di UI
interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  content: string;
  sources?: Source[];
}

export default function ChatPage() {
  const { user, token } = useAuth(); // Ambil status login dan token dari Context

  // State lokal komponen
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [messageId: number]: boolean }>({});
  
  // Ref untuk auto-scroll
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Efek ini berjalan saat status login berubah (misal: user login/logout)
  useEffect(() => {
    // Fungsi untuk memformat data dari berbagai sumber ke tipe ChatMessage
    const formatHistory = (historyData: any[]): ChatMessage[] => {
        return historyData.map((item: any, index: number) => ({
            id: item.id || index,
            role: item.role,
            content: item.content || item.text, // Kompatibel dengan localStorage lama
            sources: item.sources
        }));
    };

    if (user && token) {
      // --- Logika untuk PENGGUNA LOGIN ---
      console.log("User terdeteksi, mengambil riwayat dari database...");
      const fetchHistory = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/chat/history', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const dataFromServer = await response.json();
            setChatHistory(formatHistory(dataFromServer));
          } else {
            console.error("Gagal mengambil riwayat dari server.");
          }
        } catch (error) {
          console.error("Error saat fetch riwayat:", error);
        }
      };
      fetchHistory();
    } else {
      // --- Logika untuk PENGGUNA TAMU (GUEST) ---
      console.log("User tidak terdeteksi, mengambil riwayat dari localStorage...");
      try {
        const savedHistory = localStorage.getItem('souloriaGuestHistory');
        if (savedHistory) {
          setChatHistory(formatHistory(JSON.parse(savedHistory)));
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat chat tamu:", error);
        setChatHistory([]);
      }
    }
  }, [user, token]);

  // Efek untuk menyimpan riwayat chat tamu ke localStorage
  useEffect(() => {
    if (!user) { // Hanya simpan jika user adalah tamu
      const guestHistory = chatHistory.map(({ id, role, content, sources }) => ({
        id, type: role, text: content, sources // Simpan dengan format lama agar kompatibel
      }));
      localStorage.setItem('souloriaGuestHistory', JSON.stringify(guestHistory));
    }
  }, [chatHistory, user]);

  // Efek untuk auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!query.trim() || isLoading) return;

  //   const currentQuery = query;
  //   const userMessage: ChatMessage = { id: Date.now(), role: 'user', content: currentQuery };
    
  //   setChatHistory(prev => [...prev, userMessage]);
  //   setQuery('');
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/search', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...(token && { 'Authorization': `Bearer ${token}` })
  //       },
  //       body: JSON.stringify({ query: currentQuery }),
  //     });

  //     if (!response.ok) throw new Error('Gagal mendapatkan respons dari server.');

  //     const data = await response.json();
  //     const aiMessage: ChatMessage = { id: Date.now() + 1, role: 'ai', content: data.response, sources: data.sources };
      
  //     setChatHistory(prev => [...prev, aiMessage]);
  //   } catch (err) {
  //     const errorText = err instanceof Error ? err.message : 'Terjadi kesalahan.';
  //     const errorMessage: ChatMessage = { id: Date.now() + 1, role: 'ai', content: errorText };
  //     setChatHistory(prev => [...prev, errorMessage]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    const userMessage: ChatMessage = { id: Date.now(), role: 'user', content: currentQuery };
    
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ query: currentQuery }),
      });

      if (!response.ok) throw new Error('Gagal mendapatkan respons dari server.');
      if (!response.body) throw new Error("Tidak ada body respons.");

      // Ambil sources dari header
      const sourcesHeader = response.headers.get('X-Sources');
      const sources: Source[] = sourcesHeader ? JSON.parse(sourcesHeader) : [];

      // Siapkan pesan AI kosong untuk diisi oleh stream
      const aiMessageId = Date.now() + 1;
      const initialAiMessage: ChatMessage = { id: aiMessageId, role: 'ai', content: '', sources: sources };
      setChatHistory(prev => [...prev, initialAiMessage]);

      // Baca stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        setChatHistory(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }

    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      const errorMessage: ChatMessage = { id: Date.now() + 1, role: 'ai', content: errorText };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFeedback = async (message: ChatMessage, isHelpful: boolean) => {
    if (feedbackGiven[message.id]) return;
    try {
      const userMessageQuery = [...chatHistory].reverse().find(m => m.id < message.id && m.role === 'user')?.content || 'N/A';
      
      await fetch('http://127.0.0.1:8000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessageQuery,
          response: message.content,
          is_helpful: isHelpful,
        }),
      });
      setFeedbackGiven(prev => ({ ...prev, [message.id]: true }));
    } catch (err) {
      console.error("Gagal mengirim feedback:", err);
    }
  };
  
  const clearHistory = () => {
    setChatHistory([]);
    setFeedbackGiven({});
    if (!user) {
      localStorage.removeItem('souloriaGuestHistory');
    }
    // TODO: Implementasi endpoint untuk menghapus riwayat di DB jika user login
  };

  const greeting = user ? `Hai, ${user.nama_pengguna}! Apa yang bisa dibantu?` : "Silakan ajukan pertanyaan Anda.";

  return (
        <div className="page-wrapper">
      <div className="chat-container">

    <div className="chat-container">
      <header className="chat-header">
        <h1 className="title">Konsultasi Baru</h1>
        <p className="subtitle">{greeting}</p>
        {chatHistory.length > 0 && (
          <button onClick={clearHistory} className="clear-button">Hapus</button>
        )}
      </header>

      <div className="chat-history-container">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.role}-message`}>
            {msg.content.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            
            {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
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
            
            {msg.role === 'ai' && (
              <div className="feedbackSection">
                {!feedbackGiven[msg.id] ? (
                  <>
                    <button onClick={() => handleFeedback(msg, true)} className="feedbackButton" title="Membantu">👍</button>
                    <button onClick={() => handleFeedback(msg, false)} className="feedbackButton" title="Tidak Membantu">👎</button>
                  </>
                ) : (
                  <p className="feedbackThanks">✓ Terima kasih</p>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message-bubble ai-message">
            <div className="typing-indicator"><span></span><span></span><span></span></div>
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
          <button type="submit" className="searchButton" disabled={isLoading}>Kirim</button>
        </form>
        <p className="disclaimer-chat">
          Souloria bukan pengganti saran medis profesional. <Link href="/bantuan-darurat">Butuh bantuan segera?</Link>
        </p>
      </footer>
            </div>
            </div>
    </div>
  );
}