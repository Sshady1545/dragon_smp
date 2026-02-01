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

  const SERVER_IP = 'dragonsmp.shock.gg';

  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      container.innerHTML = '';
      
      for (let i = 0; i < 30; i++) {
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
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle-${i} {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
                10% { opacity: 0.8; }
                50% { transform: translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(1.5); opacity: 1; }
                90% { opacity: 0.8; }
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
    <div>
      <div className="particles-bg" id="particles"></div>

      <header className="top-nav">
        <div className="nav-content">
          <div className="nav-left">
            <div className="logo-glow">
              <img src="/images/logo.png" alt="Logo" className="nav-logo-img" />
            </div>
            <div className="nav-title-group">
              <span className="nav-title">DRAGONSMP</span>
              <span className="nav-subtitle">OFFICIAL SERVER</span>
            </div>
          </div>
          <div className="nav-right">
            <div className="online-status">
              <span className={`status-dot ${status?.online ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'} block pulse`}></span>
              <span className="status-text">
                {status?.online ? 'SUNUCU AKTİF' : 'BAĞLANIYOR...'}
              </span>
              {status?.online && <span className="player-number">{status.players.online}</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="main-container">
        <div className="left-column">
          <div className="card logo-card">
            <img src="/images/logo.png" alt="DragonSMP" className="main-dragon-logo" />
          </div>
          
          <div className="ip-container" onClick={() => copyToClipboard(SERVER_IP)}>
            <div className="ip-icon"><i className="fa-solid fa-server"></i></div>
            <div className="ip-content">
              <span className="ip-label">SERVER IP</span>
              <span className="ip-text">{SERVER_IP}</span>
            </div>
            <div className="ip-copy-btn"><i className="fa-regular fa-copy"></i></div>
          </div>
        </div>

        <div className="card store-card" onClick={() => showToast('STORE YAKINDA!', 'Bu özellik yakında aktif olacak')}>
          <div className="overlay">
            <h2>STORE</h2>
            <div className="card-badge">YAKINDA</div>
          </div>
          <img src="/images/store.png" className="card-bg-img" />
        </div>

        <div className="card social-card">
          <h3 className="card-title">TOPLULUK</h3>
          <a href="https://youtube.com/@Sshady1545" target="_blank" className="social-box yt">
            <div className="social-info"><strong>4,000+</strong><span>YouTube</span></div>
            <div className="social-arrow"><i className="fa-solid fa-arrow-right"></i></div>
          </a>
          <a href="https://discord.gg/JUj7SHGdF6" target="_blank" className="social-box dc">
            <div className="social-info"><strong>1,000+</strong><span>Discord</span></div>
            <div className="social-arrow"><i className="fa-solid fa-arrow-right"></i></div>
          </a>
        </div>

        <div className="card stats-card" onClick={() => showToast('İSTATİSTİKLER YAKINDA!', 'Bu özellik yakında aktif olacak')}>
          <div className="overlay">
            <h2>STATS</h2>
            <div className="card-badge">YAKINDA</div>
          </div>
          <img src="/images/stats.jpg" className="card-bg-img" />
        </div>

        <div className="card join-card">
          <div className="join-header"><h3>NASIL KATILIRIM?</h3></div>
          <div className="join-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content"><span className="step-title">Minecraft'ı Aç</span></div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content"><span className="step-title">Multiplayer'a Gir</span></div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content w-full">
                <span className="step-title">IP'yi Gir</span>
                {/* DÜZELTME: Kaymayı engelleyen h-auto ve break-all yapısı */}
                <div className="inline-ip h-auto min-h-[40px] py-2 px-3 flex flex-wrap items-center justify-center gap-2" onClick={() => copyToClipboard(SERVER_IP)}>
                  <span className="mc-font text-[10px] xs:text-xs leading-tight break-all text-center">
                    {SERVER_IP}
                  </span>
                  <i className="fa-solid fa-copy text-xs flex-shrink-0"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div id="toast" className={`toast ${toast.show ? '' : 'hidden'}`}>
        <div className="toast-content">
          <span className="toast-title">{toast.title}</span>
          <span className="toast-desc">{toast.desc}</span>
        </div>
      </div>

      <footer className="text-center py-6 text-gray-600 text-xs relative z-10">
        © 2026 DragonSMP | Official. All rights reserved.
      </footer>

      {showSecret && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowSecret(false)}>
          <div className="bg-gray-900 border border-red-500/50 p-8 rounded-2xl max-w-md w-full text-center relative">
            <button onClick={() => setShowSecret(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            <h2 className="text-4xl font-bold text-red-500 mb-8 tracking-widest animate-pulse">:)</h2>
            {!secretMessage ? (
              <input 
                type="text" value={secretInput} 
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  setSecretInput(val);
                  if (['bay4lly', 'gofret', 'forget1221'].includes(val)) setSecretMessage('bu site Bay4lly tarafından kodlanmıştır');
                  else if (val === 'shady1545') {
                    setSecretMessage('Shady1545 YouTube Kanalına Gidiliyor...');
                    setTimeout(() => window.open('https://youtube.com/@Sshady1545', '_blank'), 1000);
                  }
                }}
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white text-center font-mono" autoFocus 
              />
            ) : <p className="text-xl font-bold text-white font-mono animate-pulse">{secretMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;