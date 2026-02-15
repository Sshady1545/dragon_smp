import { useEffect, useState } from 'react';
import './assets/css/style.css';
import './assets/css/all.min.css';

interface ServerStatus {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
}

function App() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [toast, setToast] = useState<{ show: boolean; title: string; desc: string }>({ show: false, title: '', desc: '' });
  
  const [keyBuffer, setKeyBuffer] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretMessage, setSecretMessage] = useState('');

  // Form Modal durumu
  const [showForm, setShowForm] = useState(false);

  const SERVER_IP = 'dragonsmp.shock.gg';
  const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdwCv4goir8J8XQ1jxoGbFdnV5MzK96DSA7PAVIhcf8EsLuAw/viewform?embedded=true";

  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      container.innerHTML = '';
      
      for (let i = 0; i < 35; i++) { // Parçacık sayısını biraz artırdık
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        
        // RENK DEĞİŞİMİ: Kırmızıdan Altın Sarısına (Ramazan Kandili Efekti)
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          left: ${startX}%;
          top: ${startY}%;
          animation: float-particle-${i} ${duration}s ease-in-out ${delay}s infinite;
          pointer-events: none;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle-${i} {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
                10% { opacity: 0.6; }
                50% { transform: translate(${(Math.random() - 0.5) * 150}px, ${(Math.random() - 0.5) * 150}px) scale(1.8); opacity: 0.9; }
                90% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
        container.appendChild(particle);
      }
    };

    createParticles();
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSecret) {
        if (e.key === 'Escape') {
          setShowSecret(false);
          setSecretInput('');
          setSecretMessage('');
        }
        return;
      }

      setKeyBuffer((prev) => {
        const updated = (prev + e.key).slice(-6).toLowerCase();
        if (updated === 'secret') {
          setShowSecret(true);
          setKeyBuffer('');
        }
        return updated;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSecret]);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Server status check failed', error);
    }
  };

  const copyToClipboard = (text: string, message: string = "IP ADRESİ KOPYALANDI!") => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message, "IP adresi panoya kopyalandı");
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(message, "IP adresi panoya kopyalandı");
    });
  };

  const showToast = (title: string, desc: string) => {
    setToast({ show: true, title, desc });
    setTimeout(() => setToast({ show: false, title: '', desc: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] transition-colors duration-1000">
      <div className="particles-bg opacity-60" id="particles"></div>

      <header className="top-nav !bg-slate-950/80 !border-b-[#fbbf24]/30 backdrop-blur-md">
        <div className="nav-content">
          <div className="nav-left">
            <div className="logo-glow !shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              <img src="/images/logo.png" alt="Logo" className="nav-logo-img" />
            </div>
            <div className="nav-title-group">
              <span className="nav-title !text-[#fbbf24]">DRAGONSMP</span>
              <span className="nav-subtitle text-slate-400">RAMAZAN ÖZEL</span>
            </div>
          </div>
          <div className="nav-right">
            <div className="online-status !bg-slate-900/50 border border-[#fbbf24]/20" id="server-status">
              <span className={`status-dot ${status?.online ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-red-500'} block pulse`}></span>
              <span className="status-text !text-slate-200">
                {status?.online ? 'SUNUCU AKTİF' : 'BAĞLANIYOR...'}
              </span>
              {status?.online && (
                <span className="player-number !bg-[#fbbf24] !text-black">{status.players.online}</span>
              )}
            </div>
          </div>
        </div>
        <div className="nav-glow !from-[#fbbf24]/10"></div>
      </header>

      <main className="main-container">
        <div className="left-column">
          <div className="card logo-card !border-[#fbbf24]/20 !bg-slate-900/40">
            <div className="logo-ring !border-[#fbbf24]/30"></div>
            <div className="logo-ring ring-2 !border-[#fbbf24]/10"></div>
            <img src="/images/logo.png" alt="DragonSMP" className="main-dragon-logo drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
            {/* Alevleri kandil ışığı rengine çevirdik */}
            <div className="logo-flames">
                <div className="flame !bg-[#fbbf24]"></div>
                <div className="flame !bg-[#f59e0b]"></div>
                <div className="flame !bg-[#fbbf24]"></div>
            </div>
          </div>
          
          <div className="ip-container !bg-[#fbbf24] !text-black hover:!bg-[#f59e0b]" onClick={() => copyToClipboard(SERVER_IP)} id="copy-ip">
            <div className="ip-icon"><i className="fa-solid fa-moon"></i></div>
            <div className="ip-content">
              <span className="ip-label !text-black/70">SUNUCU ADRESİ</span>
              <span className="ip-text font-bold text-black">{SERVER_IP}</span>
            </div>
            <div className="ip-copy-btn !text-black"><i className="fa-regular fa-copy"></i></div>
          </div>
        </div>

        <div className="card store-card !border-[#fbbf24]/20" data-modal="store" onClick={() => showToast('HAYIRLI RAMAZANLAR!', 'Market yakında özel indirimlerle açılacak')}>
            <div className="card-shine opacity-10"></div>
            <div className="overlay bg-gradient-to-t from-slate-950 to-transparent">
                <div className="card-icon !text-[#fbbf24]"><i className="fa-solid fa-star-and-crescent"></i></div>
                <h2 className="text-[#fbbf24]">MARKET</h2>
                <p className="text-slate-300">Ramazan ayına özel ürünler</p>
                <div className="card-badge !bg-amber-600 !text-white">YAKINDA</div>
            </div>
            <img src="/images/store.png" className="card-bg-img opacity-40" />
            <div className="hover-border !border-[#fbbf24]"></div>
        </div>

        <div className="card social-card !bg-slate-900/40 !border-[#fbbf24]/20">
            <div className="card-shine opacity-10"></div>
            <h3 className="card-title !text-[#fbbf24]"><i className="fa-solid fa-mosque"></i> TOPLULUK</h3>
            <a href="https://youtube.com/@Sshady1545" target="_blank" className="social-box yt !bg-red-900/20 border border-red-500/20">
                <div className="social-icon"><i className="fab fa-youtube text-red-500"></i></div>
                <div className="social-info">
                    <strong className="social-number text-white">4,000+</strong>
                    <span className="social-label text-slate-400">Abone</span>
                </div>
                <div className="social-arrow text-red-500"><i className="fa-solid fa-arrow-right"></i></div>
            </a>
            <a href="https://discord.gg/JUj7SHGdF6" target="_blank" className="social-box dc !bg-indigo-900/20 border border-indigo-500/20">
                <div className="social-icon"><i className="fab fa-discord text-indigo-400"></i></div>
                <div className="social-info">
                    <strong className="social-number text-white">1,000+</strong>
                    <span className="social-label text-slate-400">Üye</span>
                </div>
                <div className="social-arrow text-indigo-400"><i className="fa-solid fa-arrow-right"></i></div>
            </a>
            <div className="hover-border !border-[#fbbf24]"></div>
        </div>

        <div className="card stats-card !border-[#fbbf24]/20" onClick={() => setShowForm(true)}>
            <div className="card-shine opacity-10"></div>
            <div className="overlay bg-gradient-to-t from-slate-950 to-transparent">
                <div className="card-icon !text-[#fbbf24]"><i className="fa-solid fa-scroll"></i></div>
                <h2 className="text-[#fbbf24]">REHBER BAŞVURUSU</h2>
                <p className="text-slate-300">Ramazanda ekibimize katılın</p>
                <div className="card-badge !bg-emerald-600 !text-white">AKTİF</div>
            </div>
            <img src="/images/stats.jpg" className="card-bg-img opacity-40" />
            <div className="hover-border !border-[#fbbf24]"></div>
        </div>

        <div className="card join-card !bg-slate-900/40 !border-[#fbbf24]/20">
            <div className="card-shine opacity-10"></div>
            <div className="join-header">
                <i className="fa-solid fa-kaaba text-[#fbbf24]"></i>
                <h3 className="text-[#fbbf24]">NASIL KATILIRIM?</h3>
            </div>
            <div className="join-steps">
                <div className="step">
                    <div className="step-number !bg-[#fbbf24] !text-black">1</div>
                    <div className="step-content">
                        <span className="step-title text-slate-200">Minecraft'ı Aç</span>
                        <span className="step-desc text-slate-400 text-xs">Sürüm: 1.8 - 1.21.x</span>
                    </div>
                </div>
                <div className="step">
                    <div className="step-number !bg-[#fbbf24] !text-black">2</div>
                    <div className="step-content">
                        <span className="step-title text-slate-200">Çoklu Oyuncu</span>
                        <span className="step-desc text-slate-400 text-xs">Sunucu Ekle butonuna bas</span>
                    </div>
                </div>
                <div className="step">
                    <div className="step-number !bg-[#fbbf24] !text-black">3</div>
                    <div className="step-content w-full">
                        <span className="step-title text-slate-200">Adresi Yapıştır</span>
                        <div className="inline-ip !bg-black/40 !border-[#fbbf24]/40 !text-[#fbbf24] min-h-[40px] py-1 px-2 flex items-center justify-between gap-1 overflow-hidden" id="copy-ip-2" onClick={() => copyToClipboard(SERVER_IP)}>
                            <span className="mc-font text-[8px] sm:text-[10px] whitespace-nowrap">
                                {SERVER_IP}
                            </span>
                            <i className="fa-solid fa-copy text-[10px] flex-shrink-0"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hover-border !border-[#fbbf24]"></div>
        </div>
      </main>

{/* GOOGLE FORM MODAL - Ramazan Temalı */}
{showForm && (
  <div 
    className="fixed inset-0 z-[9999] bg-slate-950/90 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xl" 
    onClick={() => setShowForm(false)}
  >
      <div 
        className="bg-[#0f172a] border-2 border-[#fbbf24]/40 w-full max-w-5xl h-[90vh] rounded-3xl relative flex flex-col overflow-hidden shadow-[0_0_100px_rgba(251,191,36,0.1)]" 
        onClick={e => e.stopPropagation()}
      >
          {/* Üst Bar */}
          <div className="p-5 border-b border-[#fbbf24]/10 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-4">
                  <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_#fbbf24]" />
                  <div>
                    <h3 className="text-[#fbbf24] font-bold tracking-[0.2em] text-sm sm:text-lg">BAŞVURU FORMU</h3>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest">DragonSMP Ekip Alımları</p>
                  </div>
              </div>
              
              <button 
                onClick={() => setShowForm(false)} 
                className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg group"
              >
                  <i className="fa-solid fa-xmark text-2xl group-hover:rotate-90 transition-transform"></i>
              </button>
          </div>

          {/* Form Alanı */}
          <div className="flex-grow bg-white">
              <iframe 
                  src={FORM_URL}
                  className="w-full h-full"
                  frameBorder="0"
              >
                  Yükleniyor...
              </iframe>
          </div>
      </div>
  </div>
)}

      <div id="toast" className={`toast ${toast.show ? '' : 'hidden'} !bg-slate-900 !border-[#fbbf24]/50`}>
        <div className="toast-icon !text-[#fbbf24]"><i className="fa-solid fa-moon"></i></div>
        <div className="toast-content">
            <span className="toast-title !text-[#fbbf24]">{toast.title}</span>
            <span className="toast-desc text-slate-300">{toast.desc}</span>
        </div>
        <div className="toast-progress !bg-[#fbbf24]"></div>
      </div>
      
      <footer className="text-center py-8 text-slate-500 text-xs relative z-10">
        <div className="flex justify-center gap-4 mb-2 text-[#fbbf24]/40">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-moon"></i>
            <i className="fa-solid fa-star"></i>
        </div>
        © 2026 DragonSMP | Hayırlı Ramazanlar. All rights reserved.
      </footer>

      {showSecret && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 flex flex-col items-center justify-center p-4 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && setShowSecret(false)}>
            <div className="bg-slate-900 border border-[#fbbf24]/30 p-10 rounded-3xl max-w-md w-full text-center relative shadow-[0_0_80px_rgba(251,191,36,0.1)]">
                <button onClick={() => setShowSecret(false)} className="absolute top-6 right-6 text-slate-500 hover:text-[#fbbf24]">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                <div className="text-5xl mb-6">🌙</div>
                <h2 className="text-2xl font-bold text-[#fbbf24] mb-8 tracking-[0.3em] uppercase">Gizli Menü</h2>
                {!secretMessage ? (
                    <input 
                        type="text" value={secretInput}
                        onChange={(e) => {
                            const val = e.target.value.toLowerCase();
                            setSecretInput(val);
                            if (['bay4lly', 'gofret', 'forget1221'].includes(val)) {
                                setSecretMessage('Bu kutsal site Bay4lly tarafından inşa edildi.');
                            } else if (val === 'shady1545') {
                                setSecretMessage('Shady1545 Dergahına Gidiliyor...');
                                setTimeout(() => window.open('https://youtube.com/@Sshady1545', '_blank'), 1000);
                            } else if (val === 'robotic1545') {
                                setSecretMessage('Robotic1545 YouTube Kanalına Gidiliyor...');
                                setTimeout(() => window.open('https://youtube.com/@ofc-exelux', '_blank'), 1000);
                            }
                        }}
                        placeholder="Anahtar kelime..."
                        className="w-full bg-black/40 border border-[#fbbf24]/20 rounded-xl px-4 py-4 text-[#fbbf24] text-center font-mono focus:border-[#fbbf24] outline-none transition-all"
                        autoFocus
                    />
                ) : (
                    <div className="animate-pulse py-4">
                        <p className="text-lg font-medium text-slate-200 font-mono tracking-wide">{secretMessage}</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}

export default App;