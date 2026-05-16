'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';
import { S } from '@/lib/legalStyles';

type Lang = 'fr' | 'en';

const NAV: Record<Lang, { href: string; label: string }[]> = {
  fr: [
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/cgu',              label: "Conditions d'utilisation" },
    { href: '/confidentialite',  label: 'Confidentialité' },
  ],
  en: [
    { href: '/mentions-legales', label: 'Legal notice' },
    { href: '/cgu',              label: 'Terms of use' },
    { href: '/confidentialite',  label: 'Privacy policy' },
  ],
};

export default function ConfidentialiteContent() {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('horloge-live.com-language');
    if (stored === 'en') setLang('en');
  }, []);

  const isFr = lang === 'fr';

  return (
    <LegalPageLayout
      title={isFr ? 'Politique de confidentialité' : 'Privacy policy'}
      navLinks={NAV[lang]}
    >
      <p style={S.updated}>
        {isFr ? 'Dernière mise à jour : 3 mai 2026' : 'Last updated: May 3, 2026'}
      </p>

      {/* ── Intro ── */}
      <p style={S.p}>
        {isFr
          ? "La présente politique de confidentialité décrit la manière dont le site horloge-live.com collecte, utilise et protège les données personnelles de ses utilisateurs, conformément au Règlement général sur la protection des données (RGPD - UE 2016/679) et à la loi Informatique et Libertés modifiée."
          : "This privacy policy describes how horloge-live.com collects, uses and protects the personal data of its users, in accordance with the General Data Protection Regulation (GDPR – EU 2016/679) and the amended French Data Protection Act."
        }
      </p>

      {/* ── Section 1 ── */}
      <h2 style={S.h2}>
        {isFr ? '1. Données collectées' : '1. Data collected'}
      </h2>
      {isFr ? (
        <>
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
          <p style={S.p}>
            Si l'utilisateur crée un compte, les données suivantes sont également sauvegardées dans
            un espace personnel sécurisé :
          </p>
          <ul style={{ ...S.p, paddingLeft: '20px', margin: '0 0 12px 0' }}>
            <li>Préférences de personnalisation (police, taille, couleur du texte, fond d'écran, format 12h/24h, mode miroir, affichage de la date, langue)</li>
            <li>Liste des villes ajoutées pour l'horloge mondiale (limitée à 6 villes personnalisées)</li>
            <li>Historique des sessions de chronomètre et minuteur (type d'outil, durée, date et heure de la session) — limité aux 50 sessions les plus récentes</li>
          </ul>
          <p style={S.p}>
            Ces données sont synchronisées automatiquement entre tous les appareils où l'utilisateur
            se connecte avec le même compte.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            The site distinguishes two situations depending on whether the user creates an account
            or not:
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Without an account:</strong> no personal data is collected.
            Customization preferences (font, background, colors, time format) are stored locally on
            the user's device via the browser's localStorage mechanism. This data never leaves the
            device and is not transmitted to the publisher.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>With an account (optional):</strong> upon registration, the
            following data is collected: the user's email address and, if Google authentication is
            used, the public profile information transmitted by Google (first name, last name, email
            address). No phone number is required. The date and time of acceptance of the legal terms
            are recorded.
          </p>
        </>
      )}

      {/* ── Section 2 ── */}
      <h2 style={S.h2}>
        {isFr ? '2. Finalité de la collecte' : '2. Purpose of data collection'}
      </h2>
      {isFr ? (
        <>
          <p style={S.p}>
            Les données collectées lors de la création d'un compte sont utilisées exclusivement aux
            fins suivantes :
          </p>
          <ul style={{ ...S.p, paddingLeft: '20px', margin: '0 0 12px 0' }}>
            <li>Permettre la connexion et l'authentification sécurisée de l'utilisateur</li>
            <li>Synchroniser les préférences de personnalisation (police, couleurs, fond, format d'heure, langue) entre tous les appareils de l'utilisateur</li>
            <li>Sauvegarder les villes personnalisées ajoutées à l'horloge mondiale</li>
            <li>Conserver l'historique des sessions de chronomètre et minuteur (50 sessions maximum)</li>
          </ul>
          <p style={S.p}>
            Aucune donnée n'est utilisée à des fins publicitaires, commerciales ou de profilage.
            Aucune donnée n'est vendue, cédée ou transmise à des tiers, à l'exception des
            sous-traitants techniques mentionnés ci-après.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Sous-traitants :</strong>
          </p>
          <ul style={{ ...S.p, paddingLeft: '20px', margin: '0 0 12px 0' }}>
            <li>Firebase Authentication (Google LLC) pour la gestion de l'authentification</li>
            <li>Firebase Firestore (Google LLC) pour le stockage sécurisé des préférences, de l'historique des sessions et des villes personnalisées</li>
          </ul>
          <p style={S.p}>
            Google LLC est soumis aux clauses contractuelles types de la Commission européenne
            garantissant un niveau de protection adéquat des données.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            Data collected upon account creation is used exclusively for the following purpose:
            enabling secure user login and authentication.
          </p>
          <p style={S.p}>
            No data is used for advertising, commercial or profiling purposes. No data is sold,
            transferred or shared with third parties, except for the technical subcontractors listed
            below.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Subcontractors:</strong> Firebase Authentication (Google LLC)
            for authentication management. Google LLC is subject to the European Commission's
            standard contractual clauses, guaranteeing an adequate level of data protection.
          </p>
        </>
      )}

      {/* ── Section 3 ── */}
      <h2 style={S.h2}>
        {isFr ? '3. Durée de conservation' : '3. Data retention'}
      </h2>
      {isFr ? (
        <>
          <p style={S.p}>
            Les données du compte utilisateur (adresse e-mail, préférences synchronisées, villes
            personnalisées de l'horloge mondiale, historique des sessions) sont conservées pendant
            toute la durée d'existence du compte. L'utilisateur peut supprimer son compte à tout
            moment depuis les paramètres de son profil, ce qui entraîne la suppression définitive et
            immédiate de l'ensemble de ses données personnelles.
          </p>
          <p style={S.p}>
            L'historique des sessions de chronomètre et minuteur est automatiquement plafonné à 50
            entrées. Lorsque la limite est atteinte, les sessions les plus anciennes sont
            automatiquement supprimées pour faire place aux nouvelles.
          </p>
          <p style={S.p}>
            Les données stockées en localStorage sur l'appareil de l'utilisateur sont conservées
            jusqu'à ce que l'utilisateur les efface manuellement (via les paramètres du navigateur
            ou l'option de réinitialisation du site) ou jusqu'à la suppression du cache du navigateur.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            User account data (email address, synchronized preferences) is retained for the entire
            duration of the account's existence. The user may delete their account at any time from
            their profile settings, which results in the immediate and permanent deletion of all their
            personal data.
          </p>
          <p style={S.p}>
            Data stored in localStorage on the user's device is retained until the user manually
            clears it (via browser settings or the site's reset option) or until the browser cache
            is deleted.
          </p>
        </>
      )}

      {/* ── Section 4 ── */}
      <h2 style={S.h2}>
        {isFr ? "4. Droits de l'utilisateur" : '4. User rights'}
      </h2>
      {isFr ? (
        <>
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
            <strong style={S.strong}>Droit à l'effacement (« droit à l'oubli ») :</strong> obtenir
            la suppression de ses données, sous réserve des obligations légales de conservation.
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
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
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
        </>
      ) : (
        <>
          <p style={S.p}>
            In accordance with the GDPR, users have the following rights regarding their personal data:
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Right of access:</strong> obtain confirmation that data
            concerning them is being processed and receive a copy.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Right of rectification:</strong> have inaccurate or incomplete
            data corrected.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Right to erasure ("right to be forgotten"):</strong> obtain the
            deletion of their data, subject to legal retention obligations.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Right to data portability:</strong> receive their data in a
            structured, commonly used format.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Right to object:</strong> object at any time to the processing
            of their data.
          </p>
          <p style={S.p}>
            To exercise these rights, users may contact the publisher at:{' '}
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
            . A response will be provided within a maximum of 30 days.
          </p>
          <p style={S.p}>
            Users may also lodge a complaint with the French data protection authority (CNIL) at{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={S.a}>
              www.cnil.fr
            </a>
            .
          </p>
        </>
      )}

      {/* ── Section 5 ── */}
      <h2 style={S.h2}>
        {isFr ? '5. Cookies et localStorage' : '5. Cookies and localStorage'}
      </h2>
      {isFr ? (
        <>
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
            Firebase Authentication utilise des cookies techniques strictement nécessaires à la
            gestion de la session d'authentification. Ces cookies ne sont déposés que si l'utilisateur
            crée un compte et se connecte.
          </p>
          <p style={{ ...S.p, ...S.em }}>
            Aucun bandeau de consentement aux cookies n'est requis pour les cookies strictement
            nécessaires au fonctionnement du service, conformément aux lignes directrices de la CNIL.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            horloge-live.com does not use cookies for advertising or tracking purposes. The only
            local storage mechanisms used are:
          </p>
          <p style={S.p}>
            <strong style={S.strong}>localStorage:</strong> used to save customization preferences
            (font, background, colors, time format, language). This data is stored locally on the
            user's device and is never transmitted to external servers.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Firebase cookies:</strong> when logged into an account, Firebase
            Authentication uses strictly necessary technical cookies to manage the authentication
            session. These cookies are only set if the user creates an account and signs in.
          </p>
          <p style={{ ...S.p, ...S.em }}>
            No cookie consent banner is required for cookies that are strictly necessary for the
            operation of the service, in accordance with CNIL guidelines.
          </p>
        </>
      )}

      {/* ── Section 6 ── */}
      <h2 style={S.h2}>
        {isFr ? '6. Contact pour exercer ses droits' : '6. Contact for exercising rights'}
      </h2>
      {isFr ? (
        <>
          <p style={S.p}>
            <strong style={S.strong}>Responsable du traitement :</strong> Augustin GLB
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Adresse e-mail :</strong>{' '}
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
          </p>
          <p style={S.p}>
            Toute demande relative à la protection des données personnelles doit être adressée à
            l'adresse e-mail ci-dessus. L'éditeur s'engage à répondre dans un délai de 30 jours à
            compter de la réception de la demande.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            <strong style={S.strong}>Data controller:</strong> Augustin GLB
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Email address:</strong>{' '}
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
          </p>
          <p style={S.p}>
            Any request relating to the protection of personal data must be sent to the email address
            above. The publisher undertakes to respond within 30 days of receiving the request.
          </p>
        </>
      )}
    </LegalPageLayout>
  );
}
