'use client';
import Link from 'next/link';

export default function RipidoHome() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden', margin: 0, padding: 0, backgroundColor: 'black' }}>
      {/* Nota: height 100dvh previene problemi con la barra di navigazione mobile */}
      
      <style>{`
        @media (max-width: 768px) {
          .ripido-bg-img {
            object-position: 25% center !important; /* Non taglia via gli alberi a sinistra su mobile */
          }
          .ripido-logo-box {
            width: 140px !important;
            left: 50% !important;
            top: -15px !important;
            transform: translateX(-50%) !important;
          }
          .ripido-nav-bar {
            top: 115px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 95vw !important;
            justify-content: center !important;
            flex-wrap: wrap !important; /* Fa andare a capo i 4 pulsanti su due righe */
            gap: 8px !important;
            padding: 0 10px !important;
          }
          .ripido-btn {
            font-size: 10px !important;
            padding: 8px 14px !important;
            letter-spacing: 0.1em !important;
          }
          .ripido-motto-box {
            bottom: 50px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            max-width: 95vw !important;
            width: 100% !important;
            align-items: center !important; /* Centra anche il bottone bianco */
            text-align: center !important;
          }
          .ripido-motto-text {
            font-size: clamp(1.3rem, 6vw, 2.2rem) !important;
          }
          .cta-bottom {
            align-self: center !important;
            width: auto !important;
            padding: 12px 24px !important;
            font-size: 12px !important;
            margin-top: 10px !important;
          }
        }
      `}</style>

      {/* 1. SFONDO e OVERLAY SCURO */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <img 
          className="ripido-bg-img"
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
          alt="Montagne maestose" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* L'overlay è leggermente sfumato in basso per migliorare la lettura su mobile */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)' }}></div>
      </div>

      {/* 2. LOGO */}
      <div className="ripido-logo-box" style={{ position: 'absolute', top: '-25px', left: '2px', zIndex: 10, width: '240px', aspectRatio: '1 / 1' }}>
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgb(223, 254, 2)',
            WebkitMaskImage: 'url(/logo-ripido.png)',
            maskImage: 'url(/logo-ripido.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'left top',
            maskPosition: 'left top',
            filter: 'drop-shadow(2px 4px 10px rgba(0,0,0,0.5))'
          }}
        />
      </div>

      {/* 3. PULSANTI IN ALTO */}
      <div 
        className="ripido-nav-bar"
        style={{ 
          position: 'absolute', 
          top: '38px', 
          left: '55%', 
          transform: 'translateX(-50%)', 
          zIndex: 10, 
          display: 'flex', 
          gap: '24px', 
          alignItems: 'center' 
        }}
      >
        <Link 
          href="/chi-siamo"
          className="ripido-btn"
          style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 22px', border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '9999px', backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(8px)', textShadow: '0 2px 8px rgba(0,0,0,0.6)', display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          Chi siamo
        </Link>
        <Link 
          href="/prossime-uscite"
          className="ripido-btn"
          style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 22px', border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '9999px', backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(8px)', textShadow: '0 2px 8px rgba(0,0,0,0.6)', display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          Prossime Uscite
        </Link>

        <Link 
          href="/eventi"
          className="ripido-btn"
          style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 22px', border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '9999px', backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(8px)', textShadow: '0 2px 8px rgba(0,0,0,0.6)', display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          Eventi speciali
        </Link>

        <Link 
          href="/social"
          className="ripido-btn"
          style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 22px', border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '9999px', backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(8px)', textShadow: '0 2px 8px rgba(0,0,0,0.6)', display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          Social
        </Link>
      </div>

      {/* 4. TESTO */}
      <div className="ripido-motto-box" style={{ position: 'absolute', bottom: '150px', left: '40px', zIndex: 10, maxWidth: '50vw', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
        <h1 className="ripido-motto-text" style={{ color: 'white', fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)', fontWeight: 'bold', lineHeight: '1.2', margin: 0, textShadow: '2px 4px 15px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>
          The mountains are calling.<br />
          <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Your friends aren't.</span><br />
          <span style={{ color: 'rgb(223, 254, 2)' }}>Find your people.</span>
        </h1>
        
        {/* Pulsante Call to Action Primario (Nascosto da regole CSS precedenti su mobile se non aggiorniamo align-items, ma l'inline flex-start risolve per desktop) */}
        <Link 
          href="/social"
          className="cta-bottom"
          style={{ 
            backgroundColor: 'white', color: 'black', textDecoration: 'none', 
            padding: '14px 28px', borderRadius: '99px', fontWeight: 'bold', 
            textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '14px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)', marginTop: '10px',
            alignSelf: 'inherit' /* Eredita l'allineamento (sinistra su PC, centro su Mobile se gestito) */
          }}
        >
          Entra nella Community
        </Link>
      </div>

    </main>
  );
}