/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';
import { S } from '@/lib/legalStyles';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | horloge-live.com',
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgu',              label: "Conditions d'utilisation" },
  { href: '/confidentialite',  label: 'Confidentialité' },
];

export default function ConfidentialitePage() {
  return (
    <LegalPageLayout title="Politique de confidentialité" navLinks={NAV}>

      <p style={S.updated}>Dernière mise à jour : 3 mai 2026</p>

      <p style={S.p}>
        La présente politique de confidentialité décrit la manière dont le site horloge-live.com
        collecte, utilise et protège les données personnelles de ses utilisateurs, conformément au
        Règlement général sur la protection des données (RGPD - UE 2016/679) et à la loi
        Informatique et Libertés modifiée.
      </p>

      {/* ── 1. Données collectées ── */}
      <h2 style={S.h2}>1. Données collectées</h2>
      <p style={S.p}>
        Le site distingue deux situations selon que l'utilisateur crée ou non un compte :
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Sans compte :</strong> aucune donnée personnelle n'est collectée.
        Les préférences de personnalisation (police, fond, couleurs, format d'heure) sont
        enregistrées uniquement en local sur l'appareil de l'utilisateur, via le mécanisme
        localStorage de son navigateur. Ces données ne quittent jamais l'appareil et ne sont pas
        transmises à l'éditeur.
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Avec compte (optionnel) :</strong> lors de l'inscription, les
        données suivantes sont collectées : l'adresse e-mail de l'utilisateur et, si
        l'authentification Google est utilisée, les informations de profil public transmises par
        Google (prénom, nom, adresse e-mail). Aucun numéro de téléphone n'est obligatoire. La
        date et l'heure d'acceptation des conditions légales sont enregistrées.
      </p>

      {/* ── 2. Finalité de la collecte ── */}
      <h2 style={S.h2}>2. Finalité de la collecte</h2>
      <p style={S.p}>
        Les données collectées lors de la création d'un compte sont utilisées exclusivement aux
        fins suivantes : permettre la connexion et l'authentification sécurisée de l'utilisateur.
      </p>
      <p style={S.p}>
        Aucune donnée n'est utilisée à des fins publicitaires, commerciales ou de profilage.
        Aucune donnée n'est vendue, cédée ou transmise à des tiers, à l'exception des
        sous-traitants techniques mentionnés ci-après.
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Sous-traitants :</strong> Firebase Authentication (Google LLC)
        pour la gestion de l'authentification. Google LLC est soumis aux clauses contractuelles
        types de la Commission européenne garantissant un niveau de protection adéquat des données.
      </p>

      {/* ── 3. Durée de conservation ── */}
      <h2 style={S.h2}>3. Durée de conservation</h2>
      <p style={S.p}>
        Les données du compte utilisateur (adresse e-mail, préférences synchronisées) sont
        conservées pendant toute la durée d'existence du compte. L'utilisateur peut supprimer son
        compte à tout moment depuis les paramètres de son profil, ce qui entraîne la suppression
        définitive et immédiate de l'ensemble de ses données personnelles.
      </p>
      <p style={S.p}>
        Les données stockées en localStorage sur l'appareil de l'utilisateur sont conservées
        jusqu'à ce que l'utilisateur les efface manuellement (via les paramètres du navigateur ou
        l'option de réinitialisation du site) ou jusqu'à la suppression du cache du navigateur.
      </p>

      {/* ── 4. Droits de l'utilisateur ── */}
      <h2 style={S.h2}>4. Droits de l'utilisateur</h2>
      <p style={S.p}>
        Conformément au RGPD, l'utilisateur dispose des droits suivants concernant ses données
        personnelles :
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Droit d'accès :</strong> obtenir la confirmation que des données
        le concernant sont traitées et en recevoir une copie.
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Droit de rectification :</strong> faire corriger des données
        inexactes ou incomplètes.
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Droit à l'effacement (« droit à l'oubli ») :</strong> obtenir la
        suppression de ses données, sous réserve des obligations légales de conservation.
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Droit à la portabilité :</strong> recevoir ses données dans un
        format structuré et couramment utilisé.
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Droit d'opposition :</strong> s'opposer à tout moment au
        traitement de ses données.
      </p>
      <p style={S.p}>
        Pour exercer ces droits, l'utilisateur peut contacter l'éditeur à l'adresse :{' '}
        <a href="mailto:glbaugustin@gmail.com" style={S.a}>
          glbaugustin@gmail.com
        </a>
        . Une réponse sera apportée dans un délai maximum de 30 jours.
      </p>
      <p style={S.p}>
        L'utilisateur peut également introduire une réclamation auprès de la Commission nationale
        de l'informatique et des libertés (CNIL) —{' '}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={S.a}>
          www.cnil.fr
        </a>
        .
      </p>

      {/* ── 5. Cookies et localStorage ── */}
      <h2 style={S.h2}>5. Cookies et localStorage</h2>
      <p style={S.p}>
        Le site horloge-live.com n'utilise pas de cookies à des fins publicitaires ou de traçage.
        Les seuls mécanismes de stockage local utilisés sont :
      </p>
      <p style={S.p}>
        <strong style={S.strong}>localStorage :</strong> utilisé pour sauvegarder les préférences
        de personnalisation (police, fond, couleurs, format d'heure, langue). Ces données sont
        stockées localement sur l'appareil de l'utilisateur et ne sont jamais transmises à des
        serveurs externes.
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Cookies Firebase :</strong> en cas de connexion à un compte,
        Firebase Authentication utilise des cookies techniques strictement nécessaires à la gestion
        de la session d'authentification. Ces cookies ne sont déposés que si l'utilisateur crée un
        compte et se connecte.
      </p>
      <p style={{ ...S.p, ...S.em }}>
        Aucun bandeau de consentement aux cookies n'est requis pour les cookies strictement
        nécessaires au fonctionnement du service, conformément aux lignes directrices de la CNIL.
      </p>

      {/* ── 6. Contact pour exercer ses droits ── */}
      <h2 style={S.h2}>6. Contact pour exercer ses droits</h2>
      <p style={S.p}>
        <strong style={S.strong}>Responsable du traitement :</strong> Augustin GLB
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Adresse e-mail :</strong>{' '}
        <a href="mailto:glbaugustin@gmail.com" style={S.a}>
          glbaugustin@gmail.com
        </a>
      </p>
      <p style={S.p}>
        Toute demande relative à la protection des données personnelles doit être adressée à
        l'adresse e-mail ci-dessus. L'éditeur s'engage à répondre dans un délai de 30 jours à
        compter de la réception de la demande.
      </p>

    </LegalPageLayout>
  );
}
