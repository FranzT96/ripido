'use client';
import Link from 'next/link';

export default function RipidoHome() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', margin: 0, padding: 0, backgroundColor: 'black' }}>
      
      {/* 1. SFONDO e OVERLAY SCURO */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
          alt="Montagne maestose" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
      </div>

      {/* STILI RESPONSIVE DEDICATI PER SMARTPHONE */}
      <style>{`
        @media (max-width: 768px) {
          .ripido-logo-box {
            width: 140px !important;
            top: -15px !important;
            left: 0px !important;
          }
          .ripido-nav-bar {
            top: 75px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 100% !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 0 12px !important;
          }
          .ripido-btn {
            font-size: 10px !important;
            padding: 7px 12px !important;
            letter-spacing: 0.1em !important;
          }
          .ripido-motto-box {
            bottom: 45px !important;
            left: 20px !important;
            max-width: 90vw !important;
          }
          .ripido-motto-text {
            font-size: clamp(1.35rem, 5.8vw, 2.2rem) !important;
            line-height: 1.25 !important;
          }
        }
      `}</style>

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
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '10px 22px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '9999px',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            display: 'inline-block',
            whiteSpace: 'nowrap'
          }}
        >
          Chi siamo
        </Link>

        <Link 
          href="/prossime-uscite"
          className="ripido-btn"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '10px 22px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '9999px',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            display: 'inline-block',
            whiteSpace: 'nowrap'
          }}
        >
          Prossime Uscite
        </Link>

        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ripido-btn"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '10px 22px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '9999px',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            display: 'inline-block',
            whiteSpace: 'nowrap'
          }}
        >
          Social
        </a>
      </div>

      {/* 4. TESTO */}
      <div className="ripido-motto-box" style={{ position: 'absolute', bottom: '150px', left: '40px', zIndex: 10, maxWidth: '50vw' }}>
        <h1 className="ripido-motto-text" style={{ color: 'white', fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)', fontWeight: 'bold', lineHeight: '1.2', margin: 0, textShadow: '2px 4px 15px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>
          The mountains are calling.<br />
          <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Your friends aren't.</span><br />
          <span style={{ color: 'rgb(223, 254, 2)' }}>Find your people.</span>
        </h1>
      </div>

    </main>
  );
}