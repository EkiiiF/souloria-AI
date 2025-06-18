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
        <h1 className="title">Konsultasi</h1>
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