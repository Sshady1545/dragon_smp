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
      
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, rgba(255, 26, 26, 0.6) 0%, transparent 70%);
          border-radius: 50%;
          left: ${startX}%;
          top: ${startY}%;
          animation: float-particle-${i} ${duration}s ease-in-out infinite;
          pointer-events: none;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle-${i} {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
                20% { opacity: 0.5; }
                50% { transform: translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(1.5); opacity: 0.7; }
                80% { opacity: 0.3; }
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
      if (showSecret) return;
      setKeyBuffer((prev) => {
        const updated = (prev + e.key).slice(-6).toLowerCase();
        if (updated === 'secret') setShowSecret(true);
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
    } catch (error) { console.error('Status check failed', error); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("IP KOPYALANDI!", "Sunucuya katılmaya hazırsın!");
    });
  };

  const showToast = (title: string, desc: string) => {
    setToast({ show: true, title, desc });
    setTimeout(() => setToast({ show: false, title: '', desc: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600/30">
      <div className="particles-bg fixed inset-0" id="particles"></div>

      {/* --- NAV BAR (Skibidi Style) --- */}
      <header className="top-nav sticky top-0 z-[100] backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="nav-content max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="nav-left flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 group-hover:opacity-50 transition-opacity"></div>
              <img src="/images/logo.png" alt="Logo" className="w-12 h-12 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter uppercase italic">Dragon<span className="text-red-600">SMP</span></span>
              <span className="text-[10px] tracking-[0.3em] text-gray-500 font-bold uppercase">Legacy Season</span>
            </div>
          </div>

          <div className="nav-right">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${status?.online ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${status?.online ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}></div>
              <span className="text-xs font-black tracking-widest uppercase">
                {status?.online ? `${status.players.online} OYUNCU AKTİF` : 'SUNUCU KAPALI'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-container max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN (Hero) --- */}
        <div className="lg:col-span-5 space-y-8">
          <div className="card hero-card relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 blur-[100px] group-hover:bg-red-600/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-20 animate-pulse"></div>
                <img src="/images/logo.png" alt="Dragon" className="w-48 h-48 object-contain animate-[float_4s_ease-in-out_infinite]" />
              </div>
              
              <div className="space-y-4 w-full">
                <div 
                  className="ip-box bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group/ip cursor-pointer hover:bg-white/10 transition-all"
                  onClick={() => copyToClipboard(SERVER_IP)}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sunucu Adresi</span>
                    <span className="font-mono text-lg text-red-500">{SERVER_IP}</span>
                  </div>
                  <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center group-hover/ip:bg-red-600 group-hover/ip:text-white transition-all">
                    <i className="fa-regular fa-copy text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- YENİ BÖLÜM: MODLAR / ÖZELLİKLER --- */}
          <div className="card feature-card p-6 rounded-[2rem] bg-white/5 border border-white/10">
            <h3 className="text-sm font-black tracking-[0.2em] uppercase mb-6 text-gray-400">Sunucu Özellikleri</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 group hover:border-red-600/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <i className="fa-solid fa-microphone-lines text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase">Proximity Voice Chat</h4>
                  <p className="text-xs text-gray-500">Oyuncularla mesafeye göre sesli konuşun.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 group hover:border-red-600/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <i className="fa-solid fa-shield-halved text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase">Anti-Cheat & Claim</h4>
                  <p className="text-xs text-gray-500">Hilesiz ve güvenli bir hayatta kalma deneyimi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Grid) --- */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Store Card */}
          <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] h-64 border border-white/10" onClick={() => showToast('STORE YAKINDA!', 'Market sistemimiz şu an hazırlık aşamasında.')}>
            <img src="/images/store.png" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full bg-red-600 text-[10px] font-black uppercase tracking-widest">Mağaza</span>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Yakında</span>
              </div>
              <h2 className="text-2xl font-black uppercase italic italic">STORE</h2>
            </div>
          </div>

          {/* Social Card */}
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col justify-between space-y-6">
            <h3 className="text-sm font-black tracking-[0.2em] uppercase text-gray-400">Topluluk</h3>
            <div className="space-y-4">
              <a href="https://discord.gg/JUj7SHGdF6" target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 hover:bg-[#5865F2] transition-all group">
                <div className="flex items-center gap-3">
                  <i className="fab fa-discord text-2xl"></i>
                  <span className="font-bold uppercase text-sm tracking-widest">Discord</span>
                </div>
                <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"></i>
              </a>
              <a href="https://youtube.com/@Sshady1545" target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-red-600/10 border border-red-600/20 hover:bg-red-600 transition-all group">
                <div className="flex items-center gap-3">
                  <i className="fab fa-youtube text-2xl"></i>
                  <span className="font-bold uppercase text-sm tracking-widest">YouTube</span>
                </div>
                <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"></i>
              </a>
            </div>
          </div>

          {/* Application Card */}
          <div className="md:col-span-2 relative group cursor-pointer overflow-hidden rounded-[2rem] p-8 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-all" onClick={() => setShowForm(true)}>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 text-3xl shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <i className="fa-solid fa-id-badge"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Yetki Başvurusu</h2>
                  <p className="text-sm text-green-500/60 font-medium">DragonSMP ekibine katılmak için hemen formu doldur!</p>
                </div>
              </div>
              <div className="px-8 py-3 rounded-xl bg-green-500 text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform">
                BAŞVURU YAP
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODALS & EXTRAS --- */}
      {showForm && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]" onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/10 w-full max-w-5xl h-[85vh] rounded-[2.5rem] overflow-hidden relative shadow-[0_0_100px_rgba(255,0,0,0.15)]" onClick={e => e.stopPropagation()}>
            <div className="absolute top-6 right-6 z-[1001]">
              <button onClick={() => setShowForm(false)} className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:rotate-90 transition-all">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <iframe src={FORM_URL} className="w-full h-full bg-white" frameBorder="0">Yükleniyor...</iframe>
          </div>
        </div>
      )}

      {/* Secret & Toast (Aynı Yapı) */}
      <div className={`toast fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] px-8 py-4 rounded-2xl bg-black border border-white/10 flex items-center gap-4 transition-all duration-500 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center">
          <i className="fa-solid fa-check"></i>
        </div>
        <div>
          <h4 className="font-black text-sm uppercase tracking-tighter">{toast.title}</h4>
          <p className="text-xs text-gray-500">{toast.desc}</p>
        </div>
      </div>

      <footer className="py-12 text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em] opacity-40">
        © 2026 DRAGON SMP • PREMIUM MINECRAFT EXPERIENCE
      </footer>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default App;