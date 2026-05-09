/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';
import { S } from '@/lib/legalStyles';

export const metadata: Metadata = {
  title: 'Mentions légales | horloge-live.com',
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgu',              label: "Conditions d'utilisation" },
  { href: '/confidentialite',  label: 'Confidentialité' },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout title="Mentions légales" navLinks={NAV}>

      <p style={S.updated}>Dernière mise à jour : 3 mai 2026</p>

      {/* ── 1. Informations sur l'éditeur ── */}
      <h2 style={S.h2}>1. Informations sur l'éditeur</h2>
      <p style={S.p}>
        <strong style={S.strong}>Nom de l'éditeur :</strong> Augustin GLB
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Statut :</strong> Particulier - éditeur non professionnel, mineur
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Adresse e-mail :</strong>{' '}
        <a href="mailto:glbaugustin@gmail.com" style={S.a}>
          glbaugustin@gmail.com
        </a>
      </p>
      <p style={S.p}>
        <strong style={S.strong}>Site web :</strong> horloge-live.com
      </p>
      <p style={{ ...S.p, ...S.em }}>
        Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
        l'économie numérique (LCEN), les coordonnées complètes de l'éditeur sont tenues à
        disposition sur simple demande envoyée à l'adresse e-mail ci-dessus.
      </p>

      {/* ── 2. Hébergement ── */}
      <h2 style={S.h2}>2. Hébergement</h2>
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

      {/* ── 3. Propriété intellectuelle ── */}
      <h2 style={S.h2}>3. Propriété intellectuelle</h2>
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

      {/* ── 4. Données personnelles (RGPD) ── */}
      <h2 style={S.h2}>4. Données personnelles (RGPD)</h2>
      <p style={S.p}>
        Le traitement des données personnelles collectées sur ce site est détaillé dans la
        Politique de confidentialité, accessible depuis le bas de toutes les pages du site.
      </p>
      <p style={S.p}>
        Conformément au Règlement général sur la protection des données (RGPD - UE 2016/679) et
        à la loi Informatique et Libertés modifiée, l'utilisateur dispose d'un droit d'accès, de
        rectification, d'effacement et de portabilité de ses données, qu'il peut exercer en
        contactant l'éditeur à l'adresse :{' '}
        <a href="mailto:glbaugustin@gmail.com" style={S.a}>
          glbaugustin@gmail.com
        </a>
      </p>
      <p style={{ ...S.p, ...S.em }}>
        Ce site est un projet personnel à vocation non commerciale. Aucune publicité, aucun
        abonnement et aucune vente n'y sont pratiqués.
      </p>

    </LegalPageLayout>
  );
}
