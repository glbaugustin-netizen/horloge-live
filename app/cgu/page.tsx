/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';
import { S } from '@/lib/legalStyles';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | horloge-live.com",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgu',              label: "Conditions d'utilisation" },
  { href: '/confidentialite',  label: 'Confidentialité' },
];

export default function CguPage() {
  return (
    <LegalPageLayout title="Conditions générales d'utilisation" navLinks={NAV}>

      <p style={S.updated}>Dernière mise à jour : 3 mai 2026</p>

      {/* ── 1. Objet du site ── */}
      <h2 style={S.h2}>1. Objet du site</h2>
      <p style={S.p}>
        Le site horloge-live.com est un service gratuit et accessible à tous permettant d'afficher
        l'heure exacte en temps réel dans un navigateur web. Il propose également des outils
        complémentaires (chronomètre, minuteur) ainsi que des options de personnalisation visuelle
        de l'interface.
      </p>
      <p style={S.p}>
        Ce site est édité à titre personnel et non commercial. Son accès et son utilisation sont
        entièrement gratuits. Aucune inscription n'est requise pour utiliser les fonctionnalités
        de base. La création d'un compte est optionnelle.
      </p>

      {/* ── 2. Conditions d'utilisation ── */}
      <h2 style={S.h2}>2. Conditions d'utilisation</h2>
      <p style={S.p}>
        L'accès au site est ouvert à toute personne disposant d'une connexion à internet et d'un
        navigateur web compatible. L'utilisateur reconnaît utiliser le site sous sa propre
        responsabilité.
      </p>
      <p style={S.p}>
        L'utilisateur s'engage à utiliser le site de manière licite, dans le respect des présentes
        CGU et de la législation applicable. Il est interdit de tenter de perturber, d'altérer ou
        d'interrompre le fonctionnement du site, de ses serveurs ou de ses réseaux associés.
      </p>
      <p style={S.p}>
        Les fonctionnalités de personnalisation (polices, fonds d'écran, couleurs) sont mises à
        disposition pour un usage personnel. L'utilisateur s'engage à ne pas utiliser la
        fonctionnalité d'import d'image personnalisée pour charger des contenus illicites,
        offensants ou portant atteinte aux droits de tiers.
      </p>

      {/* ── 3. Responsabilités ── */}
      <h2 style={S.h2}>3. Responsabilités</h2>
      <p style={S.p}>
        L'éditeur s'efforce de maintenir le site accessible et fonctionnel en permanence. Toutefois,
        il ne saurait être tenu responsable des interruptions de service liées à des opérations de
        maintenance, à des défaillances techniques de l'hébergeur, ou à tout événement indépendant
        de sa volonté.
      </p>
      <p style={S.p}>
        L'heure affichée sur le site est synchronisée avec l'heure du navigateur de l'utilisateur,
        elle-même mise à jour via les protocoles de temps standards (NTP). L'éditeur ne peut être
        tenu responsable d'une éventuelle imprécision liée à la configuration de l'appareil de
        l'utilisateur.
      </p>
      <p style={S.p}>
        L'éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de
        l'utilisation du site ou de l'impossibilité d'y accéder. En particulier, toute décision
        prise par l'utilisateur sur la base de l'heure affichée relève de sa seule responsabilité.
      </p>

      {/* ── 4. Modification des CGU ── */}
      <h2 style={S.h2}>4. Modification des CGU</h2>
      <p style={S.p}>
        L'éditeur se réserve le droit de modifier les présentes conditions générales d'utilisation
        à tout moment, notamment pour les adapter à l'évolution du site ou à la réglementation en
        vigueur.
      </p>
      <p style={S.p}>
        Les modifications entrent en vigueur dès leur publication sur cette page. La date de mise
        à jour est systématiquement indiquée en haut du document. L'utilisation continue du site
        après publication des modifications vaut acceptation des nouvelles CGU.
      </p>
      <p style={S.p}>
        Pour toute question relative aux présentes conditions, l'utilisateur peut contacter
        l'éditeur à l'adresse :{' '}
        <a href="mailto:glbaugustin@gmail.com" style={S.a}>
          glbaugustin@gmail.com
        </a>
      </p>

    </LegalPageLayout>
  );
}
