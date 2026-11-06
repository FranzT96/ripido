'use client';

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

      {/* 2. LOGO: Spinto all'estremo in alto a sinistra (top 5px, left 5px) */}
      <div style={{ position: 'absolute', top: '2px', left: '2px', zIndex: 10, width: '240px' }}>
        <img 
          src="/logo-ripido.png" 
          alt="Logo Ripido" 
          style={{ width: '100%', height: 'auto', filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* 3. TESTO: INVARIATO (Bloccato nella sua posizione perfetta) */}
      <div style={{ position: 'absolute', bottom: '150px', left: '40px', zIndex: 10, maxWidth: '50vw' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)', fontWeight: 'bold', lineHeight: '1.2', margin: 0, textShadow: '2px 4px 15px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>
          The mountains are calling.<br />
          <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Your friends aren't.</span><br />
          Find your people.
        </h1>
      </div>

    </main>
  );
}