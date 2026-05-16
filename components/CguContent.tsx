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

export default function CguContent() {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('horloge-live.com-language');
    if (stored === 'en') setLang('en');
  }, []);

  const isFr = lang === 'fr';

  return (
    <LegalPageLayout
      title={isFr ? "Conditions générales d'utilisation" : 'Terms of use'}
      navLinks={NAV[lang]}
    >
      <p style={S.updated}>
        {isFr ? 'Dernière mise à jour : 3 mai 2026' : 'Last updated: May 3, 2026'}
      </p>

      {/* ── Section 1 ── */}
      <h2 style={S.h2}>
        {isFr ? '1. Objet du site' : '1. Purpose of the site'}
      </h2>
      {isFr ? (
        <>
          <p style={S.p}>
            Le site horloge-live.com est un service gratuit et accessible à tous permettant d'afficher
            l'heure exacte en temps réel dans un navigateur web. Il propose également des outils
            complémentaires : chronomètre, minuteur, horloge mondiale (affichage simultané de plusieurs
            fuseaux horaires), ainsi que des options de personnalisation visuelle de l'interface.
          </p>
          <p style={S.p}>
            Ce site est édité à titre personnel et non commercial. Son accès et son utilisation sont
            entièrement gratuits. Aucune inscription n'est requise pour utiliser les fonctionnalités
            de base. La création d'un compte est optionnelle et permet de synchroniser les préférences
            de personnalisation sur plusieurs appareils et de conserver un historique des sessions de
            chronomètre et minuteur.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            horloge-live.com is a free service accessible to all, allowing users to display the exact
            time in real time in a web browser. It also offers additional tools (stopwatch, timer) as
            well as visual customization options for the interface.
          </p>
          <p style={S.p}>
            This site is published on a personal and non-commercial basis. Access and use are entirely
            free. No registration is required to use the basic features. Account creation is optional.
          </p>
        </>
      )}

      {/* ── Section 2 ── */}
      <h2 style={S.h2}>
        {isFr ? "2. Conditions d'utilisation" : '2. Terms of use'}
      </h2>
      {isFr ? (
        <>
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
        </>
      ) : (
        <>
          <p style={S.p}>
            Access to the site is open to anyone with an internet connection and a compatible web
            browser. The user acknowledges using the site at their own risk.
          </p>
          <p style={S.p}>
            The user agrees to use the site lawfully, in compliance with these Terms and applicable
            law. It is prohibited to attempt to disrupt, alter or interrupt the operation of the site,
            its servers or associated networks.
          </p>
          <p style={S.p}>
            The customization features (fonts, wallpapers, colors) are provided for personal use. The
            user agrees not to use the custom image import feature to upload unlawful, offensive or
            third-party rights-infringing content.
          </p>
        </>
      )}

      {/* ── Section 3 ── */}
      <h2 style={S.h2}>
        {isFr ? '3. Responsabilités' : '3. Liability'}
      </h2>
      {isFr ? (
        <>
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
        </>
      ) : (
        <>
          <p style={S.p}>
            The publisher strives to keep the site accessible and functional at all times. However,
            the publisher cannot be held liable for service interruptions due to maintenance
            operations, technical failures of the hosting provider, or any event beyond the
            publisher's control.
          </p>
          <p style={S.p}>
            The time displayed on the site is synchronized with the user's browser time, which is
            itself updated via standard time protocols (NTP). The publisher cannot be held liable for
            any inaccuracy related to the user's device configuration.
          </p>
          <p style={S.p}>
            The publisher cannot be held liable for any direct or indirect damages resulting from the
            use of the site or inability to access it. In particular, any decision made by the user
            based on the displayed time is solely their responsibility.
          </p>
        </>
      )}

      {/* ── Section 4 ── */}
      <h2 style={S.h2}>
        {isFr ? '4. Modification des CGU' : '4. Amendments to the terms'}
      </h2>
      {isFr ? (
        <>
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
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            The publisher reserves the right to modify these terms of use at any time, in particular
            to adapt them to changes in the site or applicable regulations.
          </p>
          <p style={S.p}>
            Amendments take effect upon publication on this page. The update date is always indicated
            at the top of the document. Continued use of the site after publication of changes
            constitutes acceptance of the new Terms.
          </p>
          <p style={S.p}>
            For any questions regarding these terms, users may contact the publisher at:{' '}
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
          </p>
        </>
      )}
    </LegalPageLayout>
  );
}
