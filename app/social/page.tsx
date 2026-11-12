'use client';
import Link from 'next/link';

export default function Social() {
  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', backgroundColor: 'black', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      <style>{`
        .social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 50px;
        }
        .step-card {
          background-color: rgba(255,255,255,0.03);
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
          border: 1px solid rgba(223, 254, 2, 0.2);
          padding: 30px;
          border-radius: 16px;
        }
        @media (max-width: 768px) {
          .social-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .action-buttons {
            flex-direction: column;
          }
          .btn-main, .btn-sec {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      {/* Navigazione */}
      <div style={{ maxWidth: '900px', margin: '0 auto', marginBottom: '40px' }}>
        <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          &larr; Torna alla Home
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Titolo Principale */}
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', marginBottom: '40px', letterSpacing: '0.05em', textAlign: 'center' }}>
          Entra in <span style={{ color: 'rgb(223, 254, 2)' }}>Ripido</span>
        </h1>

        {/* 1. Spiegazione dei due passaggi */}
        <div className="social-grid">
          <div className="step-card">
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: 'rgb(223, 254, 2)' }}>01. Instagram</h2>
            <p style={{ margin: 0, color: '#aaa', lineHeight: '1.6' }}>
              La nostra vetrina e il punto di primo contatto. Seguici per vivere le nostre escursioni tramite foto e storie. <strong>Scrivici in DM</strong> per presentarti, dirci di dove sei e che esperienza hai in montagna.
            </p>
          </div>
          
          <div className="step-card">
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 15px 0', color: 'white' }}>02. WhatsApp</h2>
            <p style={{ margin: 0, color: '#aaa', lineHeight: '1.6' }}>
              Il nostro vero campo base operativo. Una volta dentro avrai accesso alla bacheca generale, ai <strong>sottogruppi regionali</strong> e alle chat dedicate all'organizzazione delle singole uscite nel weekend.
            </p>
          </div>
        </div>

        {/* 2. Pulsanti d'azione */}
        <div className="action-buttons">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-main"
            style={{ 
              backgroundColor: 'white', color: 'black', textDecoration: 'none', 
              padding: '15px 30px', borderRadius: '99px', fontWeight: 'bold', 
              textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '14px' 
            }}
          >
            Vai su Instagram
          </a>
          
          <button 
            className="btn-sec"
            onClick={(e) => e.preventDefault()} // Disattivato per ora
            style={{ 
              backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', 
              padding: '15px 30px', borderRadius: '99px', fontWeight: 'bold', cursor: 'default',
              textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '14px', opacity: 0.5
            }}
          >
            Entra su WhatsApp
          </button>
        </div>

        {/* 3. Regole d'oro */}
        <div className="rules-box">
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