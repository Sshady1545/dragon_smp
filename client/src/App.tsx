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
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, rgba(255, 26, 26, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          left: ${startX}%;
          top: ${startY}%;
          animation: float-particle-${i} ${duration}s ease-in-out ${delay}s infinite;
          pointer-events: none;
          z-index: 0;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle-${i} {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
                10% { opacity: 0.6; }
                50% { transform: translate(${(Math.random() - 0.5) * 150}px, ${(Math.random() - 0.5) * 150}px) scale(1.8); opacity: 0.8; }
                90% { opacity: 0.4; }
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
    <div className="selection:bg-red-600/30">
      <div className="particles-bg" id="particles"></div>

      <header className="top-nav !backdrop-blur-md !bg-black/40 border-b border-white/5">
        <div className="nav-content">
          <div className="nav-left group">
            <div className="logo-glow group-hover:scale-110 transition-transform duration-500">
              <img src="/images/logo.png" alt="Logo" className="nav-logo-img" />
            </div>
            <div className="nav-title-group">
              <span className="nav-title tracking-tighter">DRAGON<span className="text-red-600">SMP</span></span>
              <span className="nav-subtitle opacity-60">OFFICIAL SERVER</span>
            </div>
          </div>
          <div className="nav-right">
            <div className="online-status !bg-white/5 !border-white/10" id="server-status">
              <span className={`status-dot ${status?.online ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-red-500'} block pulse`}></span>
              <span className="status-text font-bold">
                {status?.online ? 'SUNUCU AKTİF' : 'BAĞLANIYOR...'}
              </span>
              {status?.online && (
                <span className="player-number !bg-red-600 !text-white">{status.players.online}</span>
              )}
            </div>
          </div>
        </div>
        <div className="nav-glow"></div>
      </header>

      <main className="main-container relative z-10">
        <div className="left-column">
          <div className="card logo-card !bg-transparent !border-none overflow-visible">
            <div className="logo-ring animate-[spin_10s_linear_infinite]"></div>
            <div className="logo-ring ring-2 animate-[spin_15s_linear_infinite_reverse]"></div>
            {/* Logo Süzülme Animasyonu */}
            <img 
              src="/images/logo.png" 
              alt="DragonSMP" 
              className="main-dragon-logo animate-[bounce_4s_ease-in-out_infinite] hover:drop-shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all" 
            />
            <div className="logo-flames">
                <div className="flame"></div>
                <div className="flame"></div>
                <div className="flame"></div>
            </div>
          </div>
          
          <div className="ip-container hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer" onClick={() => copyToClipboard(SERVER_IP)} id="copy-ip">
            <div className="ip-icon"><i className="fa-solid fa-server"></i></div>
            <div className="ip-content">
              <span className="ip-label">SERVER IP</span>
              <span className="ip-text tracking-widest">{SERVER_IP}</span>
            </div>
            <div className="ip-copy-btn"><i className="fa-regular fa-copy"></i></div>
          </div>
        </div>

        {/* STORE KARTI - Hover Geliştirmesi */}
        <div className="card store-card group hover:-translate-y-2 transition-all duration-500" data-modal="store" onClick={() => showToast('STORE YAKINDA!', 'Bu özellik yakında aktif olacak')}>
            <div className="card-shine"></div>
            <div className="overlay group-hover:bg-black/20 transition-colors">
                <div className="card-icon group-hover:scale-110 transition-transform"><i className="fa-solid fa-shopping-cart"></i></div>
                <h2 className="group-hover:tracking-widest transition-all">STORE</h2>
                <p>Marketten alışveriş yapın</p>
                <div className="card-badge shadow-lg">YAKINDA</div>
            </div>
            <img src="/images/store.png" className="card-bg-img group-hover:scale-110 transition-transform duration-700" />
            <div className="hover-border !border-red-600/50"></div>
        </div>

        <div className="card social-card hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all">
            <div className="card-shine"></div>
            <h3 className="card-title"><i className="fa-solid fa-users text-red-600"></i> TOPLULUK</h3>
            <a href="https://youtube.com/@Sshady1545" target="_blank" className="social-box yt group hover:!bg-red-600/10 transition-all">
                <div className="social-icon group-hover:rotate-12 transition-transform"><i className="fab fa-youtube"></i></div>
                <div className="social-info">
                    <strong className="social-number">4,000+</strong>
                    <span className="social-label">YouTube Abonesi</span>
                </div>
                <div className="social-arrow"><i className="fa-solid fa-arrow-right"></i></div>
            </a>
            <a href="https://discord.gg/JUj7SHGdF6" target="_blank" className="social-box dc group hover:!bg-indigo-600/10 transition-all">
                <div className="social-icon group-hover:-rotate-12 transition-transform"><i className="fab fa-discord"></i></div>
                <div className="social-info">
                    <strong className="social-number">1,000+</strong>
                    <span className="social-label">Discord Üyesi</span>
                </div>
                <div className="social-arrow"><i className="fa-solid fa-arrow-right"></i></div>
            </a>
            <div className="hover-border"></div>
        </div>

        {/* YETKİ BAŞVURU KARTI - Parlama Efekti */}
        <div className="card stats-card group hover:-translate-y-2 transition-all duration-500 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]" onClick={() => setShowForm(true)}>
            <div className="card-shine"></div>
            <div className="overlay">
                <div className="card-icon animate-pulse"><i className="fa-solid fa-id-badge text-green-500"></i></div>
                <h2 className="group-hover:tracking-widest transition-all">YETKİ BAŞVURUSU</h2>
                <p>Ekibimize katılmak için formu doldurun</p>
                <div className="card-badge !bg-green-600 animate-bounce">AKTİF</div>
            </div>
            <img src="/images/stats.jpg" className="card-bg-img group-hover:scale-110 transition-transform duration-700" />
            <div className="hover-border !border-green-600/50"></div>
        </div>

        <div className="card join-card hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] transition-all">
            <div className="card-shine"></div>
            <div className="join-header">
                <i className="fa-solid fa-gamepad text-red-600"></i>
                <h3>NASIL KATILIRIM?</h3>
            </div>
            <div className="join-steps">
                {[
                  { num: 1, title: "Minecraft'ı Aç", desc: "Bedrock/Java Edition 1.8-1.21.11" },
                  { num: 2, title: "Multiplayer'a Gir", desc: "Ana menüden seç" }
                ].map(step => (
                  <div className="step group" key={step.num}>
                      <div className="step-number group-hover:bg-red-600 transition-colors">{step.num}</div>
                      <div className="step-content">
                          <span className="step-title">{step.title}</span>
                          <span className="step-desc">{step.desc}</span>
                      </div>
                  </div>
                ))}
                <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content w-full">
                        <span className="step-title">IP'yi Gir</span>
                        <div className="inline-ip min-h-[40px] py-1 px-2 flex items-center justify-between gap-1 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer" id="copy-ip-2" onClick={() => copyToClipboard(SERVER_IP)}>
                            <span className="mc-font text-[8px] sm:text-[10px] whitespace-nowrap opacity-80">
                                {SERVER_IP}
                            </span>
                            <i className="fa-solid fa-copy text-[10px] flex-shrink-0"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hover-border"></div>
        </div>
      </main>

      {/* GOOGLE FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]" onClick={() => setShowForm(false)}>
            <div className="bg-[#0f0f0f] border-2 border-red-600/30 w-full max-w-5xl h-[92vh] rounded-3xl relative flex flex-col overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.2)] animate-[scaleUp_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#151515]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20">
                           <img src="/images/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                        </div>
                        <h3 className="text-white font-black tracking-[0.2em] text-sm sm:text-base uppercase">BAŞVURU FORMU</h3>
                    </div>
                    <button onClick={() => setShowForm(false)} className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:rotate-90 shadow-lg active:scale-90">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>
                <div className="flex-grow bg-white">
                    <iframe src={FORM_URL} className="w-full h-full" frameBorder="0">Yükleniyor...</iframe>
                </div>
            </div>
        </div>
      )}

      <div id="toast" className={`toast ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} transition-all duration-500 shadow-2xl`}>
        <div className="toast-icon !bg-green-500"><i className="fa-solid fa-check-circle"></i></div>
        <div className="toast-content">
            <span className="toast-title text-green-500">{toast.title}</span>
            <span className="toast-desc">{toast.desc}</span>
        </div>
        <div className="toast-progress !bg-green-500"></div>
      </div>
      
      <footer className="text-center py-8 text-gray-500 text-[10px] tracking-[0.3em] uppercase opacity-50 relative z-10">
        © 2026 DragonSMP | Official Server. Tüm hakları saklıdır.
      </footer>

      {showSecret && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-[fadeIn_0.5s]" onClick={(e) => e.target === e.currentTarget && setShowSecret(false)}>
            <div className="bg-gray-900/80 border border-red-500/30 p-10 rounded-[2.5rem] max-w-md w-full text-center relative shadow-[0_0_100px_rgba(255,0,0,0.15)]">
                <button onClick={() => setShowSecret(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                <h2 className="text-5xl font-black text-red-600 mb-8 tracking-tighter animate-pulse">SECRET</h2>
                {!secretMessage ? (
                    <input 
                        type="text" value={secretInput}
                        onChange={(e) => {
                            const val = e.target.value.toLowerCase();
                            setSecretInput(val);
                            if (['bay4lly', 'gofret', 'forget1221'].includes(val)) {
                                setSecretMessage('Bu site Bay4lly tarafından sevgiyle kodlanmıştır ❤️');
                            } else if (val === 'shady1545') {
                                setSecretMessage('Shady1545 YouTube Kanalına Gidiliyor...');
                                setTimeout(() => window.open('https://youtube.com/@Sshady1545', '_blank'), 1000);
                            }
                        }}
                        placeholder="Şifreyi gir..."
                        className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white text-center font-mono focus:border-red-600 transition-colors outline-none"
                        autoFocus
                    />
                ) : (
                    <div className="animate-bounce mt-4">
                        <p className="text-lg font-bold text-white font-mono">{secretMessage}</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Ek Animasyonlar İçin Inline CSS */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      `}</style>
    </div>
  );
}

export default App;