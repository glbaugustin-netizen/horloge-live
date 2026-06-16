/* ═══════════════════════════════════════════════════════════════
   Données des articles du hub /conseils
   — Étape 1 : structure uniquement, contenu rédigé dans une étape
     ultérieure (content / faq restent vides pour l'instant).
═══════════════════════════════════════════════════════════════ */

export interface ConseilArticle {
  slug: string;
  title: string; // H1
  metaTitle: string; // pour <title>, avec { absolute: '...' }
  metaDescription: string; // 155 caractères max
  excerpt: string; // résumé court pour la carte sur le hub
  relatedTool: string; // ex: '/examen'
  relatedToolLabel: string; // ex: 'Mode Examen'
  content: string; // markdown, vide pour l'instant
  faq: { question: string; answer: string }[]; // vide pour l'instant
}

export const articles: ConseilArticle[] = [
  {
    slug: 'technique-pomodoro-revisions',
    title: "Technique Pomodoro : comment l'utiliser pour réviser",
    metaTitle: 'Technique Pomodoro pour réviser | horloge-live.com',
    metaDescription:
      "Découvrez comment utiliser la technique Pomodoro pour organiser ses révisions, rester concentré et éviter la fatigue mentale.",
    excerpt:
      "La méthode Pomodoro découpe les révisions en cycles courts pour rester concentré sans s'épuiser.",
    relatedTool: '/minuteur',
    relatedToolLabel: 'Minuteur en ligne',
    content: '',
    faq: [],
  },
  {
    slug: 'gerer-son-temps-pendant-un-examen',
    title: 'Comment gérer son temps pendant un examen',
    metaTitle: 'Gérer son temps pendant un examen | horloge-live.com',
    metaDescription:
      "Des conseils pratiques pour répartir son temps efficacement pendant un examen et éviter le stress de fin d'épreuve.",
    excerpt:
      "Apprenez à répartir votre temps entre les questions pour aborder chaque examen plus serein.",
    relatedTool: '/examen',
    relatedToolLabel: 'Mode Examen',
    content: '',
    faq: [],
  },
  {
    slug: 'techniques-concentration-revisions',
    title: 'Les meilleures techniques de concentration pour réviser',
    metaTitle: 'Techniques de concentration pour réviser | horloge-live.com',
    metaDescription:
      'Un tour des meilleures techniques pour améliorer sa concentration pendant les sessions de révision.',
    excerpt:
      "Plusieurs techniques simples permettent d'améliorer durablement sa concentration en période de révisions.",
    relatedTool: '/',
    relatedToolLabel: 'Mode Focus',
    content: '',
    faq: [],
  },
  {
    slug: 'combien-de-temps-reviser-par-jour',
    title: 'Combien de temps faut-il réviser par jour pour être efficace ?',
    metaTitle: 'Combien de temps réviser par jour ? | horloge-live.com',
    metaDescription:
      "Quelle durée de révision quotidienne est idéale ? Repères et conseils pour réviser efficacement sans s'épuiser.",
    excerpt:
      "La durée idéale de révision quotidienne dépend de plusieurs facteurs : voici des repères concrets.",
    relatedTool: '/minuteur',
    relatedToolLabel: 'Minuteur en ligne',
    content: '',
    faq: [],
  },
  {
    slug: 'planning-de-revisions-efficace',
    title: 'Comment créer un planning de révisions efficace',
    metaTitle: 'Créer un planning de révisions efficace | horloge-live.com',
    metaDescription:
      'Méthode étape par étape pour construire un planning de révisions réaliste et tenir ses objectifs.',
    excerpt:
      "Un bon planning de révisions repose sur des objectifs clairs et un suivi régulier du temps passé.",
    relatedTool: '/chrono',
    relatedToolLabel: 'Chronomètre en ligne',
    content: '',
    faq: [],
  },
  {
    slug: 'decalage-horaire-reunions-internationales',
    title: 'Décalage horaire : comment bien organiser ses réunions internationales',
    metaTitle: 'Décalage horaire et réunions internationales | horloge-live.com',
    metaDescription:
      'Comment anticiper le décalage horaire pour planifier des réunions internationales sans erreur de fuseau.',
    excerpt:
      "Bien gérer le décalage horaire évite les erreurs de planification lors de réunions internationales.",
    relatedTool: '/monde',
    relatedToolLabel: 'Horloge mondiale',
    content: '',
    faq: [],
  },
  {
    slug: 'personnaliser-espace-de-travail-concentration',
    title: 'Pourquoi personnaliser son espace de travail améliore la concentration',
    metaTitle: 'Personnaliser son espace de travail | horloge-live.com',
    metaDescription:
      'Comment un environnement de travail personnalisé peut renforcer la concentration et la motivation au quotidien.',
    excerpt:
      "Un espace de travail personnalisé, même numérique, favorise la concentration sur la durée.",
    relatedTool: '/',
    relatedToolLabel: 'Horloge en ligne personnalisable',
    content: '',
    faq: [],
  },
  {
    slug: 'horloge-digitale-vs-aiguilles',
    title: "Horloge digitale vs horloge à aiguilles : laquelle pour apprendre l'heure ?",
    metaTitle: 'Horloge digitale vs aiguilles | horloge-live.com',
    metaDescription:
      "Horloge digitale ou horloge à aiguilles : quelle option choisir pour apprendre à lire l'heure efficacement ?",
    excerpt:
      "Digitale ou à aiguilles : chaque type d'horloge a ses avantages pour apprendre à lire l'heure.",
    relatedTool: '/horloge-aiguille',
    relatedToolLabel: 'Horloge analogique',
    content: '',
    faq: [],
  },
  {
    slug: 'horloge-plein-ecran-presentations',
    title: 'Comment utiliser une horloge en plein écran pour les présentations',
    metaTitle: 'Horloge plein écran pour les présentations | horloge-live.com',
    metaDescription:
      "Conseils pour utiliser une horloge en plein écran lors de présentations, réunions ou ateliers.",
    excerpt:
      "Afficher une horloge en plein écran aide à cadrer le temps lors de présentations ou d'ateliers.",
    relatedTool: '/',
    relatedToolLabel: 'Horloge en plein écran',
    content: '',
    faq: [],
  },
  {
    slug: 'routine-du-soir-horloge-apaisante',
    title: "Routine du soir : comment bien s'endormir grâce à une horloge apaisante",
    metaTitle: 'Routine du soir et horloge apaisante | horloge-live.com',
    metaDescription:
      "Comment une horloge apaisante personnalisée peut s'intégrer dans une routine du soir favorable au sommeil.",
    excerpt:
      "Une routine du soir bien construite, accompagnée d'une horloge apaisante, favorise un endormissement plus serein.",
    relatedTool: '/',
    relatedToolLabel: 'Personnalisation aesthetic',
    content: '',
    faq: [],
  },
];
