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
  const [showForm, setShowForm] = useState(false);

  const SERVER_IP = 'dragonsmp.shock.gg';
  const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdwCv4goir8J8XQ1jxoGbFdnV5MzK96DSA7PAVIhcf8EsLuAw/viewform?embedded=true";

  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      container.innerHTML = '';
      
      for (let i = 0; i < 35; i++) {
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

  const copyToClipboard = (text: string, title: string = "IP ADRESİ KOPYALANDI!") => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(title, "Sunucu adresi başarıyla panoya kopyalandı.");
    });
  };

  const showToast = (title: string, desc: string) => {
    setToast({ show: true, title, desc });
    setTimeout(() => setToast({ show: false, title: '', desc: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-[#fbbf24]/30 font-sans">
      <div className="particles-bg fixed inset-0 opacity-40 pointer-events-none" id="particles"></div>

      {/* ÜST MENÜ */}
      <header className="sticky top-0 z-[60] bg-slate-950/80 border-b border-[#fbbf24]/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" className="w-10 h-10 drop-shadow-[0_0_8px_#fbbf24]" alt="Logo" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-white tracking-tighter">DRAGONSMP</h1>
              <p className="text-[10px] text-[#fbbf24] font-bold tracking-[0.3em] uppercase opacity-70">Ramazan Özel</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-[#fbbf24]/10">
            <span className={`w-2 h-2 rounded-full ${status?.online ? 'bg-[#fbbf24] shadow-[0_0_10px_#fbbf24]' : 'bg-red-500'} animate-pulse`}></span>
            <span className="text-[11px] font-bold tracking-widest uppercase">
              {status?.online ? `${status.players.online} OYUNCU AKTİF` : 'BAĞLANILIYOR...'}
            </span>
          </div>
        </div>
      </header>

      {/* ANA İÇERİK IZGARASI */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* SOL SÜTUN: LOGO VE IP */}
        <section className="space-y-6">
          <div className="bg-slate-900/40 border border-[#fbbf24]/20 rounded-[2.5rem] p-12 aspect-square flex flex-col items-center justify-center relative group backdrop-blur-md">
            <div className="absolute inset-0 bg-[#fbbf24]/10 blur-[60px] rounded-full group-hover:bg-[#fbbf24]/20 transition-all duration-700"></div>
            <img src="/images/logo.png" className="relative w-48 h-48 drop-shadow-2xl" alt="Dragon Logo" />
            <div className="absolute bottom-10 flex gap-2">
               <div className="w-1.5 h-6 bg-[#fbbf24] rounded-full blur-[1px] animate-pulse"></div>
               <div className="w-1.5 h-10 bg-[#f59e0b] rounded-full blur-[1px] animate-pulse delay-75"></div>
               <div className="w-1.5 h-6 bg-[#fbbf24] rounded-full blur-[1px] animate-pulse delay-150"></div>
            </div>
          </div>

          <div className="bg-[#fbbf24] p-5 rounded-3xl flex items-center justify-between cursor-pointer active:scale-95 transition-all group" onClick={() => copyToClipboard(SERVER_IP)}>
            <div className="flex items-center gap-4 text-black">
              <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-moon"></i>
              </div>
              <div>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest leading-none mb-1">Sunucu Adresi</p>
                <p className="text-lg font-bold tracking-tight">{SERVER_IP}</p>
              </div>
            </div>
            <i className="fa-regular fa-copy text-black/40 group-hover:text-black transition-colors"></i>
          </div>
        </section>

        {/* ORTA SÜTUN: MARKET VE TOPLULUK */}
        <section className="space-y-6">
          <div className="h-72 bg-slate-900/40 border border-[#fbbf24]/20 rounded-[2.5rem] relative overflow-hidden group cursor-pointer" onClick={() => showToast('YAKINDA!', 'Market Ramazan ayına özel indirimlerle açılacak.')}>
            <img src="/images/store.png" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" alt="Market" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent p-8 flex flex-col justify-end">
               <span className="absolute top-6 right-6 px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-lg">YAKINDA</span>
               <i className="fa-solid fa-star-and-crescent text-3xl text-[#fbbf24] mb-3"></i>
               <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">MARKET</h2>
               <p className="text-sm text-slate-400">Ramazan ayına özel ürünler</p>
            </div>
          </div>

          <div className="p-8 bg-slate-900/40 border border-[#fbbf24]/20 rounded-[2.5rem] backdrop-blur-md">
            <h3 className="text-xs font-black text-[#fbbf24] tracking-[0.2em] mb-6 uppercase flex items-center gap-2">
              <i className="fa-solid fa-mosque"></i> Topluluk
            </h3>
            <div className="space-y-3">
              <a href="https://youtube.com/@Sshady1545" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                <div className="flex items-center gap-4">
                  <i className="fab fa-youtube text-red-500 text-xl"></i>
                  <div>
                    <p className="font-bold text-sm leading-none">4,000+</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">Abone</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
              </a>
              <a href="https://discord.gg/JUj7SHGdF6" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                <div className="flex items-center gap-4">
                  <i className="fab fa-discord text-indigo-400 text-xl"></i>
                  <div>
                    <p className="font-bold text-sm leading-none">1,000+</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">Üye</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
              </a>
            </div>
          </div>
        </section>

        {/* SAĞ SÜTUN: BAŞVURU VE KATILIM */}
        <section className="space-y-6">
          <div className="h-72 bg-slate-900/40 border border-[#fbbf24]/20 rounded-[2.5rem] relative overflow-hidden group cursor-pointer" onClick={() => setShowForm(true)}>
            <img src="/images/stats.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" alt="Başvuru" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent p-8 flex flex-col justify-end">
               <span className="absolute top-6 right-6 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg animate-pulse">AKTİF</span>
               <i className="fa-solid fa-scroll text-3xl text-[#fbbf24] mb-3"></i>
               <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">BAŞVURU</h2>
               <p className="text-sm text-slate-400">Rehberlik için ekibimize katılın</p>
            </div>
          </div>

          <div className="p-8 bg-slate-900/40 border border-[#fbbf24]/20 rounded-[2.5rem] backdrop-blur-md">
            <h3 className="text-xs font-black text-[#fbbf24] tracking-[0.2em] mb-6 uppercase">Nasıl Katılırım?</h3>
            <div className="space-y-4">
              {[
                { n: '1', t: "Minecraft'ı Aç", s: 'Sürüm: 1.8 - 1.21.x' },
                { n: '2', t: "Çoklu Oyuncu", s: 'Sunucu Ekle butonuna bas' },
                { n: '3', t: "Adresi Yapıştır", s: SERVER_IP }
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <span className="w-7 h-7 bg-[#fbbf24] text-black text-[10px] font-black rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(251,191,36,0.2)]">
                    {step.n}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">{step.t}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{step.s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 text-center relative z-10">
        <div className="flex justify-center gap-4 mb-4 text-[#fbbf24]/20 text-xs">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-moon text-lg"></i>
          <i className="fa-solid fa-star"></i>
        </div>
        <p className="text-[10px] font-bold text-slate-600 tracking-[0.3em] uppercase">© 2026 DragonSMP | Hayırlı Ramazanlar</p>
      </footer>

      {/* MODAL: BAŞVURU FORMU */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 flex items-center justify-center p-4 backdrop-blur-xl" onClick={() => setShowForm(false)}>
          <div className="bg-[#0f172a] border-2 border-[#fbbf24]/40 w-full max-w-5xl h-[85vh] rounded-[3rem] relative flex flex-col overflow-hidden shadow-2xl shadow-[#fbbf24]/5" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#fbbf24]/10 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-4">
                <img src="/images/logo.png" className="w-10 h-10 drop-shadow-[0_0_8px_#fbbf24]" alt="Logo" />
                <h3 className="text-[#fbbf24] font-black tracking-widest text-lg uppercase italic">Başvuru Formu</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="w-12 h-12 bg-[#fbbf24] hover:bg-[#f59e0b] text-black rounded-2xl flex items-center justify-center transition-all duration-300">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <iframe src={FORM_URL} className="flex-grow bg-white" title="Form">Yükleniyor...</iframe>
          </div>
        </div>
      )}

      {/* TOAST BİLDİRİMİ */}
      {toast.show && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 border border-[#fbbf24]/50 p-4 rounded-3xl flex items-center gap-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-10 h-10 bg-[#fbbf24] rounded-2xl flex items-center justify-center text-black">
            <i className="fa-solid fa-bell"></i>
          </div>
          <div>
            <p className="text-[#fbbf24] font-bold text-xs uppercase tracking-widest">{toast.title}</p>
            <p className="text-slate-400 text-[10px]">{toast.desc}</p>
          </div>
        </div>
      )}

      {/* GİZLİ MENÜ (SECRET) */}
      {showSecret && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 flex flex-col items-center justify-center p-4 backdrop-blur-md" onClick={() => {setShowSecret(false); setSecretMessage(''); setSecretInput('');}}>
          <div className="bg-slate-900 border border-[#fbbf24]/30 p-10 rounded-[3rem] max-w-md w-full text-center relative" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-6">🌙</div>
            <h2 className="text-2xl font-black text-[#fbbf24] mb-8 tracking-[0.2em] uppercase italic">Gizli Dergah</h2>
            {!secretMessage ? (
              <input 
                type="text" 
                value={secretInput}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  setSecretInput(val);
                  if (['bay4lly', 'gofret', 'forget1221'].includes(val)) {
                    setSecretMessage('Bu kutsal site Bay4lly tarafından inşa edildi.');
                  } else if (val === 'shady1545') {
                    setSecretMessage('Shady1545 Dergahına Gidiliyor...');
                    setTimeout(() => window.open('https://youtube.com/@Sshady1545', '_blank'), 1000);
                  }
                }}
                placeholder="Anahtar kelime..."
                className="w-full bg-black/40 border border-[#fbbf24]/20 rounded-2xl px-4 py-4 text-[#fbbf24] text-center font-mono focus:border-[#fbbf24] outline-none transition-all shadow-inner"
                autoFocus
              />
            ) : (
              <p className="text-lg font-bold text-slate-200 animate-pulse">{secretMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;