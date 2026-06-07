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
    h1: 'Heure aesthetic en ligne — Horloge live, exacte et personnalisable',
    h2_1: 'Quelle heure est-il en ce moment ?',
    p1: "Notre horloge en ligne live affiche l'heure exacte en heures, minutes et secondes, synchronisée en temps réel avec votre navigateur. Gratuite et sans installation, elle fonctionne sur ordinateur, tablette et mobile. Consultez l'heure précise à tout moment.",
    h2_2: 'Personnalisez votre horloge en ligne',
    p2: "Choisissez parmi plus de 60 polices de caractères, modifiez la couleur du texte, et définissez une image de fond aesthetic, un paysage ou une couleur unie. Activez le mode flip clock pour un affichage rétro avec animation de cartes. Le format 12h/24h, le mode miroir et l'affichage de la date sont aussi paramétrables. Vos préférences sont sauvegardées automatiquement pour votre prochaine visite.",
    h2_3: "Affichez l'horloge en plein écran",
    p3: "Passez en mode plein écran d'un simple clic pour afficher votre horloge sur tout l'écran. Idéal pour les salles de réunion, la gestion du temps en classe ou comme horloge de bureau sur un second moniteur. Activez le mode focus depuis les paramètres pour un affichage épuré fond noir, sans distraction. Appuyez sur la touche F ou cliquez sur l'icône dédiée — appuyez sur Échap pour quitter.",
    h2_4: "Horloge plein écran pour la classe et les examens",
    p4: "Le mode plein écran affiche l'heure en grand sur tout l'écran, parfait pour la projection en salle de classe. Idéal pour les examens, les activités minutées ou simplement garder le temps visible pour tous les élèves. Fonctionne sur tableau blanc interactif, ordinateur et tablette.",
    h2_faq: "Questions fréquentes sur l'horloge en ligne",
    faq: [
      {
        q: "Qu'est-ce qu'une horloge en ligne aesthetic ?",
        a: "Une horloge en ligne aesthetic est une horloge numérique personnalisable visuellement : police, fond d'écran, couleurs et style. horloge-live.com propose plus de 60 polices et des fonds aesthetic, paysages ou couleurs unies pour créer une horloge à votre image.",
      },
      {
        q: "Quelle heure est-il maintenant ? Est-ce une horloge en ligne live ?",
        a: "Oui. L'horloge affiche l'heure exacte en temps réel, synchronisée en direct avec votre navigateur — c'est bien une horloge live. Aucun réglage nécessaire : l'heure s'affiche dès l'ouverture de la page.",
      },
      {
        q: "Comment afficher l'horloge en plein écran ?",
        a: "Cliquez sur l'icône plein écran en bas de la page ou appuyez sur la touche F de votre clavier. L'horloge occupe alors tout l'écran. Pour un affichage sans distraction, activez le mode focus depuis les paramètres avant de passer en plein écran. Pour quitter, appuyez sur Échap.",
      },
      {
        q: "L'horloge en ligne est-elle gratuite et sans inscription ?",
        a: "Oui. horloge-live.com est totalement gratuit, sans publicité et sans inscription. Aucun compte n'est nécessaire pour utiliser toutes les fonctionnalités du site.",
      },
      {
        q: "Peut-on avoir une horloge en ligne personnalisable et modifiable ?",
        a: "Oui. horloge-live.com est une horloge en ligne entièrement personnalisable et modifiable : police, taille, couleur du texte, fond aesthetic ou paysage, format 12h/24h et mode miroir. Toutes vos préférences sont sauvegardées automatiquement.",
      },
    ],
    about: "horloge-live.com est une horloge en ligne live et aesthetic, gratuite et sans publicité. Personnalisable avec plus de 60 polices et des fonds aesthetic ou paysages, cette horloge numérique en ligne s'adresse à tous — usage personnel, en classe ou en réunion. Aucune installation requise.",
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
    </section>
  );
}
