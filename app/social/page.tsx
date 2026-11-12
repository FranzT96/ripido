'use client';
import Link from 'next/link';

export default function Social() {
  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* 1. BACKGROUND MONTANO IN TRASPARENZA */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
        backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop")',
        backgroundSize: 'cover', backgroundPosition: 'center', 
        opacity: 0.15 // Regola questo numero (0.1 = quasi nero, 0.3 = più visibile)
      }} />

      {/* Sfondo nero extra per scurire ulteriormente se necessario */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: -2 }} />

      <style>{`
        /* Animazione di ingresso morbida */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-up {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 50px;
        }
        .step-card {
          background-color: rgba(20,20,20,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 16px;
        }
        .action-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 60px;
        }
        .rules-box {
          background-color: rgba(223, 254, 2, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(223, 254, 2, 0.2);
          padding: 30px;
          border-radius: 16px;
        }
        
        .btn-social {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 30px;
          border-radius: 99px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 14px;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .btn-social:hover { transform: scale(1.02); }

        @media (max-width: 768px) {
          .social-grid { grid-template-columns: 1fr; gap: 20px; }
          .action-buttons { flex-direction: column; }
          .btn-social { width: 100%; }
        }
      `}</style>

      {/* Navigazione */}
      <div className="animate-up" style={{ maxWidth: '900px', margin: '0 auto', marginBottom: '40px', animationDelay: '0s' }}>
        <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          &larr; Torna alla Home
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Titolo Principale */}
        <h1 className="animate-up" style={{ animationDelay: '0.1s', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', marginBottom: '40px', letterSpacing: '0.05em', textAlign: 'center' }}>
          Entra in <span style={{ color: 'rgb(223, 254, 2)' }}>Ripido</span>
        </h1>

        {/* 1. Spiegazione dei due passaggi */}
        <div className="social-grid">
          <div className="step-card animate-up" style={{ animationDelay: '0.2s' }}>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: 'rgb(223, 254, 2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              01. Instagram
            </h2>
            <p style={{ margin: 0, color: '#ccc', lineHeight: '1.6' }}>
              La nostra vetrina e il punto di primo contatto. Seguici per vivere le nostre escursioni tramite foto e storie. <strong>Scrivici in DM</strong> per presentarti, dirci di dove sei e che esperienza hai in montagna.
            </p>
          </div>
          
          <div className="step-card animate-up" style={{ animationDelay: '0.3s' }}>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              02. WhatsApp
            </h2>
            <p style={{ margin: 0, color: '#ccc', lineHeight: '1.6' }}>
              Il nostro vero campo base operativo. Una volta dentro avrai accesso alla bacheca generale, ai <strong>sottogruppi regionali</strong> e alle chat dedicate all'organizzazione delle singole uscite nel weekend.
            </p>
          </div>
        </div>

        {/* 2. Pulsanti d'azione (con loghi SVG) */}
        <div className="action-buttons animate-up" style={{ animationDelay: '0.4s' }}>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-social"
            style={{ backgroundColor: 'white', color: 'black' }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            Vai su Instagram
          </a>
          
          <button 
            className="btn-social"
            onClick={(e) => e.preventDefault()}
            style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', opacity: 0.5, cursor: 'default' }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Entra su WhatsApp
          </button>
        </div>

        {/* 3. Regole d'oro */}
        <div className="rules-box animate-up" style={{ animationDelay: '0.5s' }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 20px 0', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Le 3 regole d'oro
          </h3>
          <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#ccc', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><strong>Tra pari, non siamo un'agenzia:</strong> Nessuno è guida alpina. Siamo un gruppo di appassionati, ognuno è responsabile di sé stesso e della propria attrezzatura.</li>
            <li><strong>Nessuno resta indietro:</strong> Lo spirito del gruppo vince su tutto. Si parte insieme e si torna insieme al rifugio.</li>
            <li><strong>Zero spam:</strong> Nei gruppi WhatsApp parliamo solo di montagna, tracce, meteo e car sharing per le uscite.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}