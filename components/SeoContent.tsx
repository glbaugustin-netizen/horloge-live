/* eslint-disable react/no-unescaped-entities */

import { articles } from '@/lib/conseils';

const t: {
  h1: string; h2_1: string; p1: string; h2_2: string; p2: string;
  h2_3: string; p3: string; h2_4: string; p4: string; h2_faq: string;
  faq: { q: string; a: string }[];
  about: string;
} = {
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
  };

const sectionStyle: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))',
  border: '1px solid rgba(255,255,255,0.28)',
  borderRadius: '20px',
  padding: '16px 20px',
  marginBottom: '24px',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5), 0 6px 18px rgba(0,0,0,0.22)',
};

const h2Style: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.90)',
  marginBottom: '12px',
};

const pStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 400,
  color: 'var(--color-text-secondary)',
  lineHeight: 1.7,
};

/* ─── Liens contextuels vers /conseils ───────────────────── */
const CONSEIL_SLUGS = [
  'personnaliser-espace-de-travail-concentration',
  'horloge-plein-ecran-presentations',
  'routine-du-soir-horloge-apaisante',
];
const conseilLinks = CONSEIL_SLUGS
  .map((slug) => articles.find((a) => a.slug === slug))
  .filter((a): a is NonNullable<typeof a> => Boolean(a));

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.90)', marginBottom: '6px' }}>
        {question}
      </p>
      <p style={pStyle}>{answer}</p>
    </div>
  );
}

export default function SeoContent() {
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
          color: 'rgba(255,255,255,0.90)',
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

      {/* Lien contextuel vers /conseils — juste après la FAQ */}
      {conseilLinks.length > 0 && (
        <div style={{ ...sectionStyle, padding: '16px 24px' }}>
          <p style={{ ...pStyle, fontSize: '14px', marginBottom: '8px' }}>
            {'À lire aussi :'}
          </p>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            {conseilLinks.map((article) => (
              <li key={article.slug} style={{ ...pStyle, fontSize: '14px', marginBottom: '4px' }}>
                <a
                  href={`/conseils/${article.slug}`}
                  style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
                >
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

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
        {(
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
            </a>
            , l&apos;
            <a href="/examen" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              horloge mode examen
            </a>{' '}
            et nos{' '}
            <a href="/conseils" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              conseils pour réviser et se concentrer
            </a>.
          </>
        )}
      </p>
    </section>
  );
}
