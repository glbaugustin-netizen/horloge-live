'use client';
/* eslint-disable react/no-unescaped-entities */

import LegalPageLayout from '@/components/LegalPageLayout';
import { S } from '@/lib/legalStyles';

const NAV = [
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/cgu',              label: "Conditions d'utilisation" },
    { href: '/confidentialite',  label: 'Confidentialité' },
  ];

export default function ConfidentialiteContent() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      navLinks={NAV}
    >
      <p style={S.updated}>
        {'Dernière mise à jour : 29 juin 2026'}
      </p>

      {/* ── Intro ── */}
      <p style={S.p}>
        {"La présente politique de confidentialité décrit la manière dont le site horloge-live.com collecte, utilise et protège les données personnelles de ses utilisateurs, conformément au Règlement général sur la protection des données (RGPD - UE 2016/679) et à la loi Informatique et Libertés modifiée."
        }
      </p>

      {/* ── Section 1 ── */}
      <h2 style={S.h2}>
        {'1. Données collectées'}
      </h2>
      {(
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
      )}

      {/* ── Section 2 ── */}
      <h2 style={S.h2}>
        {'2. Finalité de la collecte'}
      </h2>
      {(
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
            <li>Microsoft Clarity (Microsoft Corporation) pour la mesure d'audience anonyme et l'analyse de l'expérience utilisateur (statistiques de navigation, cartes de fréquentation)</li>
          </ul>
          <p style={S.p}>
            Google LLC est soumis aux clauses contractuelles types de la Commission européenne
            garantissant un niveau de protection adéquat des données.
          </p>
        </>
      )}

      {/* ── Section 3 ── */}
      <h2 style={S.h2}>
        {'3. Durée de conservation'}
      </h2>
      {(
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
      )}

      {/* ── Section 4 ── */}
      <h2 style={S.h2}>
        {"4. Droits de l'utilisateur"}
      </h2>
      {(
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
      )}

      {/* ── Section 5 ── */}
      <h2 style={S.h2}>
        {'5. Cookies et localStorage'}
      </h2>
      {(
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
          <p style={S.p}>
            <strong style={S.strong}>Microsoft Clarity (mesure d'audience) :</strong> le site utilise
            Microsoft Clarity afin d'analyser, de manière agrégée et anonyme, la façon dont les
            visiteurs utilisent le site (pages consultées, clics, défilement, cartes de fréquentation).
            Cet outil peut déposer des cookies et collecter des données techniques (type d'appareil,
            navigateur, pages visitées). Les contenus sensibles (champs de formulaire, textes saisis)
            sont masqués automatiquement. Aucune donnée n'est utilisée à des fins publicitaires.
            Pour en savoir plus, consultez la{' '}
            <a href="https://privacy.microsoft.com/fr-fr/privacystatement" target="_blank" rel="noopener noreferrer" style={S.a}>
              déclaration de confidentialité de Microsoft
            </a>
            .
          </p>
          <p style={{ ...S.p, ...S.em }}>
            Les cookies strictement nécessaires au fonctionnement du service (authentification) ne
            requièrent pas de consentement, conformément aux lignes directrices de la CNIL. L'outil
            de mesure d'audience Microsoft Clarity n'est activé qu'après recueil du consentement
            explicite de l'utilisateur, via le bandeau affiché lors de la première visite. Ce choix
            peut être modifié à tout moment en effaçant les données du site dans le navigateur.
          </p>
        </>
      )}

      {/* ── Section 6 ── */}
      <h2 style={S.h2}>
        {'6. Contact pour exercer ses droits'}
      </h2>
      {(
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
      )}
    </LegalPageLayout>
  );
}
