'use client';
/* eslint-disable react/no-unescaped-entities */

type Lang = 'fr' | 'en';

const LABELS: Record<Lang, {
  h1: string; h2_1: string; p1: string; h2_2: string; p2: string;
  h2_3: string; p3: string; h2_4: string; p4: string; h2_faq: string;
  faq: { q: string; a: string }[];
  about: string;
}> = {
  fr: {
    h1: 'Horloge en ligne aesthetic — Heure live, exacte et personnalisable',
    h2_1: 'Quelle heure est-il en ce moment ?',
    p1: "Notre horloge en ligne affiche l'heure exacte en heures, minutes et secondes, synchronisée en temps réel avec votre navigateur via le protocole NTP. Elle se cale automatiquement sur le fuseau horaire de votre appareil dès l'ouverture de la page — aucun réglage, aucune installation requise. Entièrement gratuite et sans publicité, horloge-live.com fonctionne sur ordinateur, tablette et mobile. Des milliers d'utilisateurs consultent leur heure précise chaque jour.",
    h2_2: 'Une horloge aesthetic entièrement personnalisable',
    p2: "horloge-live.com est bien plus qu'une simple horloge numérique : c'est un outil de personnalisation visuelle pensé pour ceux qui souhaitent une horloge aesthetic à leur image. Sélectionnez parmi plus de 60 polices de caractères soigneusement choisies — du minimaliste au vintage en passant par le lo-fi aesthetic. Définissez la couleur du texte, et habillez l'arrière-plan avec une image aesthetic, un paysage naturel ou une couleur unie sobre. Activez le mode flip clock pour un affichage rétro avec animation de cartes. Le format 12h/24h, le mode miroir et l'affichage de la date sont aussi paramétrables. Toutes vos préférences aesthetic sont sauvegardées automatiquement pour votre prochaine visite.",
    h2_3: 'Mode plein écran : usage professionnel et éducatif',
    p3: "Passez en plein écran d'un simple clic sur l'icône dédiée ou en appuyant sur la touche F de votre clavier. L'horloge occupe alors tout l'écran, lisible depuis n'importe quelle distance. Idéal pour la projection sur tableau blanc interactif en salle de classe, les examens, les activités minutées et la gestion du temps collectif. Activez le mode focus (fond noir, affichage épuré) depuis les paramètres pour une horloge de bureau sans distraction sur un second moniteur ou en salle de réunion. Appuyez sur Échap pour quitter le plein écran à tout moment.",
    h2_4: 'Pourquoi choisir horloge-live.com ?',
    p4: "horloge-live.com est gratuit, sans publicité et sans inscription — toutes les fonctionnalités sont accessibles immédiatement. Synchronisée en temps réel via NTP, l'horloge respecte votre vie privée : aucune donnée personnelle n'est collectée, aucun cookie publicitaire n'est déposé. Compatible avec tous les navigateurs, mobiles, tablettes et tableaux interactifs, c'est le seul outil qui combine précision horaire et personnalisation aesthetic poussée.",
    h2_faq: "Questions fréquentes sur l'horloge en ligne",
    faq: [
      {
        q: "Qu'est-ce qu'une horloge en ligne aesthetic ?",
        a: "Une horloge en ligne aesthetic est une horloge numérique personnalisable visuellement : police, fond d'écran aesthetic, couleurs et style. horloge-live.com propose plus de 60 polices et des fonds aesthetic, paysages ou couleurs unies pour créer une horloge esthétique unique, adaptée à votre univers visuel.",
      },
      {
        q: "L'horloge affiche-t-elle l'heure exacte en temps réel ?",
        a: "Oui. horloge-live.com est une horloge en ligne live synchronisée en temps réel via le protocole NTP, directement dans votre navigateur. L'heure s'affiche dès l'ouverture de la page — aucun réglage n'est nécessaire.",
      },
      {
        q: "Comment afficher une horloge en ligne gratuite en plein écran ?",
        a: "Cliquez sur l'icône plein écran en bas de la page ou appuyez sur la touche F de votre clavier. Pour un affichage aesthetic fond noir sans distraction, activez le mode focus depuis les paramètres avant de passer en plein écran. Appuyez sur Échap pour quitter.",
      },
      {
        q: "Peut-on afficher l'heure en grand sur l'écran pour une classe ?",
        a: "Oui. Le mode plein écran affiche l'horloge numérique en grand sur tout l'écran, adapté à la projection en classe, aux examens et aux activités minutées. Compatible tableau blanc interactif, ordinateur et tablette.",
      },
      {
        q: "L'horloge en ligne est-elle vraiment gratuite et sans inscription ?",
        a: "Oui. horloge-live.com est totalement gratuit, sans publicité, sans inscription et sans collecte de données. Aucun compte n'est nécessaire pour accéder à toutes les fonctionnalités, y compris la personnalisation aesthetic complète.",
      },
      {
        q: "Peut-on personnaliser l'horloge avec un fond aesthetic ?",
        a: "Oui. horloge-live.com est une horloge en ligne entièrement personnalisable : choisissez parmi plus de 60 polices, modifiez la couleur du texte, et définissez un fond aesthetic, un paysage ou une couleur unie. Le format d'affichage (12h/24h), le mode miroir, le flip clock rétro et la date sont également paramétrables. Toutes vos préférences aesthetic sont sauvegardées automatiquement.",
      },
    ],
    about: "horloge-live.com — horloge en ligne aesthetic, live et gratuite. Personnalisable, sans pub, sans inscription.",
  },
  en: {
    h1: 'Aesthetic online clock — Exact time, live & customizable',
    h2_1: 'What time is it right now?',
    p1: 'Our live online clock displays the exact time in hours, minutes and seconds, synchronized in real time with your browser. Free and with no installation, it works on desktop, tablet and mobile. Check the precise time at any moment.',
    h2_2: 'Customize your online clock',
    p2: 'Adapt your clock to your style: choose from over 60 fonts, change the text color, and set an aesthetic background image or solid color. Enable flip clock mode for a retro display with card animations. The 12h/24h format, mirror mode, and date display are also configurable. Your preferences are saved automatically for your next visit.',
    h2_3: 'Display the clock in full screen',
    p3: 'Switch to fullscreen mode in one click to display your clock across the entire screen. Perfect for meeting rooms, classroom time management, or as a desk clock on a second monitor. Enable focus mode from settings for a distraction-free black background display. Press F or click the dedicated icon — press Esc to exit.',
    h2_4: 'Full screen clock for the classroom and exams',
    p4: 'Full screen mode displays the time large across the entire screen, perfect for classroom projection. Ideal for exams, timed activities or simply keeping time visible for all students. Works on interactive whiteboards, computers and tablets.',
    h2_faq: 'Frequently asked questions about the online clock',
    faq: [
      {
        q: 'What is an aesthetic online clock?',
        a: 'An aesthetic online clock is a visually customizable digital clock: font, wallpaper, colors and style. horloge-live.com offers over 60 fonts and aesthetic, landscape or solid color backgrounds to create a clock that matches your style.',
      },
      {
        q: 'What time is it now? Is this a live online clock?',
        a: 'Yes. The clock displays the exact time in real time, synchronized live with your browser — it is indeed a live clock. No setup needed: the time appears as soon as you open the page.',
      },
      {
        q: 'How do I display the clock in full screen?',
        a: 'Click the fullscreen icon at the bottom of the page or press F on your keyboard. The clock fills the entire screen. For a distraction-free display, enable focus mode from settings before going fullscreen. Press Esc to exit.',
      },
      {
        q: 'Is the online clock free and without registration?',
        a: 'Yes. horloge-live.com is completely free, with no ads and no registration. No account is needed to use all the features of the site.',
      },
      {
        q: 'Can I have a customizable and modifiable online clock?',
        a: 'Yes. horloge-live.com is a fully customizable and modifiable online clock: font, size, text color, aesthetic or landscape background, 12h/24h format and mirror mode. All your preferences are saved automatically.',
      },
    ],
    about: 'horloge-live.com is a free, ad-free live and aesthetic online clock. Customizable with over 60 fonts and aesthetic or landscape backgrounds, this digital online clock suits everyone — personal use, classroom or meeting. No installation required.',
  },
};

const sectionStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  WebkitBackdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '24px',
};

const h2Style: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  marginBottom: '12px',
};

const pStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--color-text-secondary)',
  lineHeight: 1.7,
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
        {question}
      </p>
      <p style={pStyle}>{answer}</p>
    </div>
  );
}

export default function SeoContent({ language }: { language: Lang }) {
  const t = LABELS[language] ?? LABELS.fr;

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '800px',
        margin: '0 auto',
        padding: '48px 24px 64px',
      }}
    >
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          textAlign: 'center',
          marginBottom: '40px',
          lineHeight: 1.3,
        }}
      >
        {t.h1}
      </h1>

      <div style={sectionStyle}>
        <h2 style={h2Style}>{t.h2_1}</h2>
        <p style={pStyle}>{t.p1}</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>{t.h2_2}</h2>
        <p style={pStyle}>{t.p2}</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>{t.h2_3}</h2>
        <p style={pStyle}>{t.p3}</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>{t.h2_4}</h2>
        <p style={pStyle}>{t.p4}</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>{t.h2_faq}</h2>
        <div style={{ marginTop: '16px' }}>
          {t.faq.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>

      <p
        style={{
          ...pStyle,
          textAlign: 'center',
          fontSize: '13px',
          opacity: 0.5,
          marginTop: '8px',
        }}
      >
        {t.about}
      </p>

      {/* Maillage interne */}
      <p style={{ ...pStyle, fontSize: '14px', marginTop: '16px' }}>
        {language === 'fr' ? (
          <>
            Découvrez aussi notre{' '}
            <a href="/horloge-aiguille" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              horloge à aiguilles en ligne
            </a>
            , le{' '}
            <a href="/chrono" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              chronomètre en ligne
            </a>
            , le{' '}
            <a href="/minuteur" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              minuteur en ligne
            </a>
            , l&apos;
            <a href="/monde" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              heure dans le monde
            </a>{' '}
            et l&apos;
            <a href="/examen" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              horloge mode examen
            </a>.
          </>
        ) : (
          <>
            Also discover our{' '}
            <a href="/horloge-aiguille" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              analog clock online
            </a>
            , our{' '}
            <a href="/chrono" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              online stopwatch
            </a>
            , our{' '}
            <a href="/minuteur" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              online timer
            </a>{' '}
            and{' '}
            <a href="/monde" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              world clock
            </a>.
          </>
        )}
      </p>
    </section>
  );
}
