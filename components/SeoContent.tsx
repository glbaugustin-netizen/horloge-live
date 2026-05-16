'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from 'react';

type Lang = 'fr' | 'en';

const LABELS: Record<Lang, {
  h1: string; h2_1: string; p1: string; h2_2: string; p2: string;
  h2_3: string; p3: string; h2_faq: string;
  faq: { q: string; a: string }[];
  about: string;
}> = {
  fr: {
    h1: 'Horloge en ligne aesthetic — Heure exacte, gratuite et personnalisable',
    h2_1: 'Quelle heure est-il en ce moment ?',
    p1: "Notre horloge numérique en ligne aesthetic affiche l'heure exacte en heures, minutes et secondes, synchronisée automatiquement avec l'heure de votre navigateur. Gratuite et sans installation, elle fonctionne sur ordinateur, tablette et mobile.",
    h2_2: 'Personnalisez votre horloge en ligne',
    p2: "Choisissez parmi plus de 60 polices de caractères, modifiez la couleur du texte, et définissez une image de fond aesthetic, un paysage ou une couleur unie. Format 12h/24h, mode miroir, affichage de la date — tout est paramétrable. Vos préférences sont sauvegardées automatiquement.",
    h2_3: "Affichez l'horloge en plein écran",
    p3: "Cliquez sur l'icône plein écran ou appuyez sur F pour afficher l'horloge sur tout l'écran. Idéal en salle de classe, en réunion ou comme horloge de bureau sur un second moniteur. Appuyez sur Échap pour quitter.",
    h2_faq: "Questions fréquentes sur l'horloge en ligne",
    faq: [
      {
        q: "Qu'est-ce qu'une horloge en ligne aesthetic ?",
        a: "Une horloge en ligne aesthetic est une horloge numérique personnalisable visuellement : police, fond d'écran, couleurs et style. horloge-live.com propose plus de 60 polices et des fonds aesthetic, paysages ou couleurs unies pour créer une horloge à votre image.",
      },
      {
        q: 'Quelle heure est-il maintenant ?',
        a: "L'horloge affiche l'heure exacte en temps réel, synchronisée automatiquement avec l'heure de votre navigateur. Aucun réglage n'est nécessaire : l'heure s'affiche dès l'ouverture de la page.",
      },
      {
        q: "Comment afficher l'horloge en plein écran ?",
        a: "Cliquez sur l'icône plein écran en bas de la page ou appuyez sur la touche F de votre clavier. L'horloge occupe alors tout l'écran. Pour quitter le mode plein écran, appuyez sur la touche Échap.",
      },
      {
        q: "L'horloge en ligne est-elle gratuite et sans inscription ?",
        a: "Oui. horloge-live.com est totalement gratuit, sans publicité et sans inscription. Aucun compte n'est nécessaire pour utiliser toutes les fonctionnalités du site.",
      },
      {
        q: "L'horloge en ligne est-elle précise ?",
        a: "Oui. L'horloge est synchronisée avec l'heure de votre système, elle-même mise à jour automatiquement via les serveurs de temps NTP. Elle affiche l'heure exacte à la seconde près.",
      },
    ],
    about: "horloge-live.com est une horloge numérique aesthetic, gratuite et sans publicité. Personnalisable avec plus de 60 polices et des fonds aesthetic ou paysages, elle s'adresse à tous — usage personnel, en classe ou en réunion. Aucune installation requise.",
  },
  en: {
    h1: 'Aesthetic online clock — Exact time, free and customizable',
    h2_1: 'What time is it right now?',
    p1: 'Our aesthetic online digital clock displays the exact time in hours, minutes and seconds, automatically synchronized with your browser. Free and with no installation, it works on desktop, tablet and mobile.',
    h2_2: 'Customize your online clock',
    p2: 'Choose from over 60 fonts, change the text color, and set an aesthetic background, landscape photo or solid color. 12h/24h format, mirror mode, date display — all customizable. Your preferences are saved automatically.',
    h2_3: 'Display the clock in full screen',
    p3: 'Click the full screen icon or press F to display the clock on your entire screen. Perfect for classrooms, meetings or as a desktop clock on a second monitor. Press Esc to exit.',
    h2_faq: 'Frequently asked questions about the online clock',
    faq: [
      {
        q: 'What is an aesthetic online clock?',
        a: 'An aesthetic online clock is a visually customizable digital clock: font, wallpaper, colors and style. horloge-live.com offers over 60 fonts and aesthetic, landscape or solid color backgrounds to create a clock that matches your style.',
      },
      {
        q: 'What time is it now?',
        a: 'The clock displays the exact time in real time, automatically synchronized with your browser. No setup needed: the time appears as soon as you open the page.',
      },
      {
        q: 'How do I display the clock in full screen?',
        a: 'Click the full screen icon at the bottom of the page or press the F key on your keyboard. The clock then fills the entire screen. To exit full screen mode, press the Escape key.',
      },
      {
        q: 'Is the online clock free and without registration?',
        a: 'Yes. horloge-live.com is completely free, with no ads and no registration. No account is needed to use all the features of the site.',
      },
      {
        q: 'Is the online clock accurate?',
        a: 'Yes. The clock is synchronized with your system time, which is automatically updated via NTP time servers. It displays the exact time to the second.',
      },
    ],
    about: 'horloge-live.com is a free, ad-free aesthetic digital clock. Customizable with over 60 fonts and aesthetic or landscape backgrounds, it suits everyone — personal use, classroom or meeting. No installation required.',
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

export default function SeoContent() {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('horloge-live.com-language');
    if (stored === 'en') setLang('en');
  }, []);

  const t = LABELS[lang];

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
