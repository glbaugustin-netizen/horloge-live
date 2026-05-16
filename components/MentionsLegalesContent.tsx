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

export default function MentionsLegalesContent() {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('horloge-live.com-language');
    if (stored === 'en') setLang('en');
  }, []);

  const isFr = lang === 'fr';

  return (
    <LegalPageLayout
      title={isFr ? 'Mentions légales' : 'Legal notice'}
      navLinks={NAV[lang]}
    >
      <p style={S.updated}>
        {isFr ? 'Dernière mise à jour : 3 mai 2026' : 'Last updated: May 3, 2026'}
      </p>

      {/* ── Section 1 ── */}
      <h2 style={S.h2}>
        {isFr ? "1. Informations sur l'éditeur" : '1. Publisher information'}
      </h2>
      {isFr ? (
        <>
          <p style={S.p}>
            <strong style={S.strong}>Nom de l'éditeur :</strong> Augustin GLB
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Statut :</strong> Particulier - éditeur non professionnel, mineur
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Adresse e-mail :</strong>{' '}
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Site web :</strong> horloge-live.com
          </p>
          <p style={{ ...S.p, ...S.em }}>
            Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
            l'économie numérique (LCEN), les coordonnées complètes de l'éditeur sont tenues à
            disposition sur simple demande envoyée à l'adresse e-mail ci-dessus.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            <strong style={S.strong}>Publisher name:</strong> Augustin GLB
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Status:</strong> Individual – non-professional publisher, minor
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Email address:</strong>{' '}
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Website:</strong> horloge-live.com
          </p>
          <p style={{ ...S.p, ...S.em }}>
            In accordance with Article 6 of French Law No. 2004-575 of June 21, 2004 on confidence
            in the digital economy (LCEN), the publisher's full contact details are available upon
            request sent to the email address above.
          </p>
        </>
      )}

      {/* ── Section 2 ── */}
      <h2 style={S.h2}>
        {isFr ? '2. Hébergement' : '2. Hosting'}
      </h2>
      {isFr ? (
        <>
          <p style={S.p}>
            <strong style={S.strong}>Hébergeur :</strong> Vercel Inc.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Adresse :</strong> 440 N Barranca Avenue #4133, Covina,
            CA 91723, États-Unis
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Site web :</strong>{' '}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={S.a}>
              https://vercel.com
            </a>
          </p>
          <p style={S.p}>
            Le nom de domaine horloge-live.com est enregistré auprès de Porkbun LLC, 6600 SW 92nd Ave
            Suite 250, Portland, OR 97223, États-Unis.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            <strong style={S.strong}>Hosting provider:</strong> Vercel Inc.
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Address:</strong> 440 N Barranca Avenue #4133, Covina,
            CA 91723, United States
          </p>
          <p style={S.p}>
            <strong style={S.strong}>Website:</strong>{' '}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={S.a}>
              https://vercel.com
            </a>
          </p>
          <p style={S.p}>
            The domain name horloge-live.com is registered with OVHcloud, 2 rue Kellermann,
            59100 Roubaix, France.
          </p>
        </>
      )}

      {/* ── Section 3 ── */}
      <h2 style={S.h2}>
        {isFr ? '3. Propriété intellectuelle' : '3. Intellectual property'}
      </h2>
      {isFr ? (
        <>
          <p style={S.p}>
            L'ensemble du contenu publié sur le site horloge-live.com - incluant, sans s'y limiter,
            les textes, la conception graphique, le code source, les polices de caractères intégrées
            et les éléments d'interface - est la propriété exclusive de l'éditeur ou fait l'objet
            d'une licence d'utilisation.
          </p>
          <p style={S.p}>
            Les photographies de fond proposées par défaut proviennent de la plateforme Unsplash et
            sont utilisées conformément à la licence Unsplash, qui autorise leur utilisation gratuite
            à des fins commerciales et non commerciales sans attribution obligatoire.
          </p>
          <p style={S.p}>
            Les polices de caractères disponibles dans l'outil de personnalisation sont proposées via
            Google Fonts et soumises à leurs licences respectives (principalement SIL Open Font
            License).
          </p>
          <p style={S.p}>
            Toute reproduction, représentation, modification ou exploitation de tout ou partie du
            contenu du site, sans autorisation écrite préalable de l'éditeur, est strictement
            interdite et susceptible de constituer une contrefaçon au sens des articles L.335-2 et
            suivants du Code de la propriété intellectuelle.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            All content published on horloge-live.com – including but not limited to texts, graphic
            design, source code, embedded fonts and interface elements – is the exclusive property of
            the publisher or is subject to a use license.
          </p>
          <p style={S.p}>
            The default background photographs come from the Unsplash platform and are used in
            accordance with the Unsplash License, which allows free use for commercial and
            non-commercial purposes without mandatory attribution.
          </p>
          <p style={S.p}>
            The fonts available in the customization tool are provided via Google Fonts and are
            subject to their respective licenses (mainly the SIL Open Font License).
          </p>
          <p style={S.p}>
            Any reproduction, representation, modification or exploitation of all or part of the
            site's content, without prior written authorization from the publisher, is strictly
            prohibited and may constitute copyright infringement under applicable law.
          </p>
        </>
      )}

      {/* ── Section 4 ── */}
      <h2 style={S.h2}>
        {isFr ? '4. Données personnelles (RGPD)' : '4. Personal data (GDPR)'}
      </h2>
      {isFr ? (
        <>
          <p style={S.p}>
            Le traitement des données personnelles collectées sur ce site est détaillé dans la
            Politique de confidentialité, accessible depuis le bas de toutes les pages du site.
          </p>
          <p style={S.p}>
            Conformément au Règlement général sur la protection des données (RGPD - UE 2016/679) et
            à la loi Informatique et Libertés modifiée, l'utilisateur dispose d'un droit d'accès, de
            rectification, d'effacement et de portabilité de ses données, qu'il peut exercer en
            contactant l'éditeur à l'adresse :{' '}
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
          </p>
          <p style={{ ...S.p, ...S.em }}>
            Ce site est un projet personnel à vocation non commerciale. Aucune publicité, aucun
            abonnement et aucune vente n'y sont pratiqués.
          </p>
        </>
      ) : (
        <>
          <p style={S.p}>
            The processing of personal data collected on this site is detailed in the Privacy Policy,
            accessible from the bottom of all pages of the site.
          </p>
          <p style={S.p}>
            In accordance with the General Data Protection Regulation (GDPR – EU 2016/679) and the
            amended French Data Protection Act, users have the right to access, rectify, erase and
            port their data, which they can exercise by contacting the publisher at:{' '}
            <a href="mailto:glbaugustin@gmail.com" style={S.a}>glbaugustin@gmail.com</a>
          </p>
          <p style={{ ...S.p, ...S.em }}>
            This site is a personal project with no commercial purpose. No advertising, subscriptions
            or sales are conducted.
          </p>
        </>
      )}
    </LegalPageLayout>
  );
}
