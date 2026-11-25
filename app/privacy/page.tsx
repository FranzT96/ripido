import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ripido',
  description: 'Informativa sul trattamento dei dati personali per gli utenti del sito e della community Ripido.',
};

export default function PrivacyPolicy() {
  const sectionStyle = {
    backgroundColor: 'rgba(20, 20, 20, 0.65)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '18px',
    padding: '28px',
    marginBottom: '20px',
  };

  const h2Style = {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'white',
    marginTop: 0,
    marginBottom: '12px',
    letterSpacing: '0.01em',
  };

  const pStyle = {
    color: '#bbb',
    lineHeight: 1.7,
    fontSize: '0.95rem',
    margin: 0,
  };

  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', color: 'white', padding: '40px 20px 80px', overflow: 'hidden' }}>
      {/* BACKGROUND LINEE TOPOGRAFICHE */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
        backgroundImage: 'url("/topografia.png")',
        backgroundSize: '400px',
        backgroundRepeat: 'repeat',
        opacity: 0.14
      }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0a0a0a', zIndex: -2 }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', marginBottom: '36px' }}>
        <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          &larr; Torna alla Home
        </Link>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '10px' }}>
            Informativa ex art. 13 Regolamento UE 2016/679 (GDPR)
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Privacy <span style={{ color: 'rgb(223, 254, 2)' }}>Policy</span>
          </h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>
            Ultimo aggiornamento: Novembre 2026
          </p>
        </div>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Chi siamo e Titolare del trattamento</h2>
          <p style={pStyle}>
            <strong>Ripido</strong> è un progetto community indipendente e senza scopo di lucro nato per mettere in contatto appassionati di escursionismo e montagna (non costituisce agenzia di viaggi né servizio di accompagnamento professionale). Per qualsiasi richiesta relativa al trattamento dei dati personali è possibile contattare i referenti e co-founder del progetto (Matteo Strippoli, Giada Tinazzi, Andrea Bosco) scrivendo all&apos;indirizzo email <strong>[inserire-email@dominio.it]</strong> oppure tramite messaggio diretto al profilo Instagram ufficiale <strong>@ripido.official</strong>.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Quali dati raccogliamo</h2>
          <ul style={{ ...pStyle, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <strong>Dati tecnici di navigazione:</strong> durante la normale consultazione del sito i sistemi informatici di hosting acquisiscono automaticamente alcuni dati tecnici (es. indirizzo IP, tipo di browser, orario della richiesta) indispensabili per la sicurezza e la corretta erogazione delle pagine.
            </li>
            <li>
              <strong>Contatti volontari su piattaforme esterne (Instagram e WhatsApp):</strong> cliccando sui collegamenti verso Instagram o accedendo ai gruppi WhatsApp della community, l&apos;utente condivide volontariamente il proprio profilo, nome, numero di telefono (visibile agli altri membri del gruppo WhatsApp secondo le impostazioni dell&apos;app) e il contenuto dei messaggi inviati.
            </li>
            <li>
              <strong>Partecipazione a uscite ed eventi speciali:</strong> qualora l&apos;utente compili moduli sul sito per prenotare un posto a escursioni a numero chiuso o eventi comunitari a rimborso spese vive, vengono raccolti i soli dati strettamente necessari all&apos;organizzazione logistica (es. nome, cognome, recapito email o telefonico ed eventuali note organizzative).
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Finalità e base giuridica del trattamento</h2>
          <p style={pStyle}>
            I dati personali vengono trattati esclusivamente per: (a) consentire la navigazione sicura sul sito web (legittimo interesse ex art. 6, par. 1, lett. f GDPR); (b) gestire le richieste volontarie di ingresso nella community e il coordinamento logistico delle singole escursioni o degli eventi speciali (esecuzione di misure precontrattuali o organizzative richieste dall&apos;interessato ex art. 6, par. 1, lett. b GDPR). I dati non vengono in alcun caso venduti a terzi né utilizzati per profilazione pubblicitaria o invio di comunicazioni commerciali indesiderate.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Cookie e strumenti di tracciamento</h2>
          <p style={pStyle}>
            Questo sito utilizza esclusivamente risorse tecniche strettamente necessarie al funzionamento e alla visualizzazione delle pagine (inclusi i caratteri tipografici ospitati direttamente sull&apos;infrastruttura del sito tramite Next.js). <strong>Non vengono utilizzati cookie di profilazione pubblicitaria né sistemi di tracciamento analitico di terze parti</strong>; pertanto non è richiesta l&apos;acquisizione di consenso tramite banner cookie.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Destinatari, fornitori tecnici e conservazione</h2>
          <p style={pStyle}>
            Il sito web è ospitato sull&apos;infrastruttura cloud di <strong>Vercel Inc.</strong>, mentre l&apos;archiviazione dei dati dinamici relativi a bacheca uscite ed eventuali prenotazioni si appoggia a <strong>Supabase Inc.</strong>, fornitori che operano nel rispetto delle clausole contrattuali standard e delle garanzie previste dal GDPR. L&apos;interazione sui canali social e di messaggistica avviene sulle piattaforme gestite da <strong>Meta Platforms Ireland Ltd.</strong> (Instagram e WhatsApp), secondo le rispettive informative privacy. I dati raccolti per singole uscite o eventi vengono conservati per il solo tempo necessario allo svolgimento dell&apos;iniziativa e successivamente cancellati, mentre la permanenza nei gruppi WhatsApp cessa immediatamente quando l&apos;utente sceglie di abbandonare il gruppo.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Diritti dell&apos;interessato</h2>
          <p style={pStyle}>
            Ai sensi degli artt. 15–22 del GDPR, ogni utente ha il diritto di chiedere in qualsiasi momento l&apos;accesso ai propri dati personali, la rettifica, la cancellazione, la limitazione del trattamento o di opporsi al loro utilizzo scrivendo ai recapiti indicati al punto 1. Resta inoltre fermo il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it) qualora ritenga violati i propri diritti.
          </p>
        </section>
      </div>
    </main>
  );
}