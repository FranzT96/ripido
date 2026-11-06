'use client';

export default function RipidoHome() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', margin: 0, padding: 0, backgroundColor: 'black' }}>
      
      {/* 1. SFONDO (Mantenuto identico) e OVERLAY SCURO */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
          alt="Montagne maestose" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
      </div>

      {/* 2. LOGO: Forzato in alto a sx (Top 40px, Left 40px) e rimpicciolito (Larghezza 120px) */}
      <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 10, width: '120px' }}>
        <img 
          src="/logo-ripido.png" 
          alt="Logo Ripido" 
          style={{ width: '100%', height: 'auto', filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* 3. TESTO: Forzato BIANCO e in basso a sx (Bottom 80px, Left 40px) */}
      <div style={{ position: 'absolute', bottom: '80px', left: '40px', zIndex: 10, maxWidth: '800px' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 'bold', lineHeight: '1.1', margin: 0, textShadow: '2px 4px 15px rgba(0,0,0,0.9)' }}>
          The mountains are calling.<br />
          <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Your friends aren't.</span><br />
          Find your people.
        </h1>
      </div>

    </main>
  );
}