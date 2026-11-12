'use client';

/**
 * Mode « image dans l'image » (Picture-in-Picture) — comme une vidéo YouTube
 * détachée : petite fenêtre flottante, toujours au premier plan, qui reste
 * visible même si le navigateur est réduit ou caché.
 *
 * Principe : la scène (heure, chrono, cadran…) est dessinée dans un <canvas>,
 * dont le flux est branché sur une <video> envoyée en PiP natif.
 * Le rafraîchissement est cadencé par un Web Worker : contrairement à
 * setInterval / requestAnimationFrame, il n'est pas gelé quand l'onglet est caché.
 *
 * Chrome / Edge desktop : Document PiP (fenêtre HTML, sans contrôles vidéo).
 * Safari (macOS / iOS), Chrome Android : PiP vidéo natif.
 * Firefox n'expose pas d'API PiP → le bouton n'est pas affiché.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type PipScene =
  /** Grand texte centré (heure, chrono, minuteur) + ligne secondaire optionnelle */
  | { kind: 'text'; main: string; sub?: string }
  /** Cadran analogique */
  | { kind: 'analog'; date: Date; showNumbers?: boolean; sub?: string }
  /** Liste « libellé — valeur » (horloges du monde) */
  | { kind: 'list'; rows: { label: string; value: string }[] };

export interface PipStyle {
  font?: string;
  textColor?: string;
  /** Valeur CSS du fond : couleur (#0A0A0A) ou url('/backgrounds/x.webp') */
  background?: string;
}

const W = 640;
const H = 360;
const TICK_MS = 200;

const WORKER_SRC = `let id=null;onmessage=(e)=>{clearInterval(id);if(e.data>0)id=setInterval(()=>postMessage(0),e.data);};`;

/* ── Cache des images de fond ─────────────────────────────── */
const bgCache = new Map<string, HTMLImageElement>();
function getBgImage(src: string): HTMLImageElement | null {
  let img = bgCache.get(src);
  if (!img) {
    img = new Image();
    img.src = src;
    bgCache.set(src, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}

function drawBackground(ctx: CanvasRenderingContext2D, bg: string | undefined) {
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(0, 0, W, H);
  if (!bg) return;
  const m = bg.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
  if (m) {
    const img = getBgImage(m[1]);
    if (img) {
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      // Voile léger pour la lisibilité du texte sur photo
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, W, H);
    }
  } else {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }
}

/** Taille de police maximale pour que `text` tienne dans `maxW` */
function fitFont(ctx: CanvasRenderingContext2D, text: string, family: string, weight: number, maxW: number, maxSize: number) {
  let size = maxSize;
  ctx.font = `${weight} ${size}px ${family}`;
  const w = ctx.measureText(text).width;
  if (w > maxW) size = Math.floor(size * (maxW / w));
  ctx.font = `${weight} ${size}px ${family}`;
  return size;
}

function drawScene(ctx: CanvasRenderingContext2D, scene: PipScene, style: PipStyle) {
  drawBackground(ctx, style.background);

  const color = style.textColor || '#FFFFFF';
  const family = style.font ? `'${style.font}', Inter, sans-serif` : 'Inter, sans-serif';
  const uiFamily = '-apple-system, BlinkMacSystemFont, Inter, sans-serif';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 12;

  if (scene.kind === 'text') {
    ctx.fillStyle = color;
    const size = fitFont(ctx, scene.main, family, 600, W * 0.88, scene.sub ? 170 : 190);
    const y = scene.sub ? H / 2 - 22 : H / 2;
    ctx.fillText(scene.main, W / 2, y);
    if (scene.sub) {
      ctx.globalAlpha = 0.6;
      fitFont(ctx, scene.sub, uiFamily, 400, W * 0.85, 26);
      ctx.fillText(scene.sub, W / 2, y + size / 2 + 34);
      ctx.globalAlpha = 1;
    }
    return;
  }

  if (scene.kind === 'list') {
    const rows = scene.rows.slice(0, 6);
    const rowH = Math.min(70, (H - 40) / Math.max(rows.length, 1));
    const top = (H - rowH * rows.length) / 2;
    rows.forEach((row, i) => {
      const y = top + rowH * i + rowH / 2;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.65;
      ctx.textAlign = 'left';
      fitFont(ctx, row.label, uiFamily, 400, W * 0.42, rowH * 0.42);
      ctx.fillText(row.label, 48, y);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'right';
      fitFont(ctx, row.value, family, 600, W * 0.45, rowH * 0.62);
      ctx.fillText(row.value, W - 48, y);
    });
    ctx.textAlign = 'center';
    return;
  }

  /* ── Cadran analogique ── */
  const r = scene.sub ? 130 : 150;
  const cx = W / 2;
  const cy = scene.sub ? H / 2 - 18 : H / 2;
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.stroke();

  ctx.strokeStyle = color;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const major = i % 5 === 0;
    const inner = r - (major ? 16 : 8);
    ctx.globalAlpha = major ? 0.9 : 0.35;
    ctx.lineWidth = major ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.sin(a) * inner, cy - Math.cos(a) * inner);
    ctx.lineTo(cx + Math.sin(a) * (r - 4), cy - Math.cos(a) * (r - 4));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  if (scene.showNumbers) {
    ctx.fillStyle = color;
    ctx.font = `500 22px ${uiFamily}`;
    for (let n = 1; n <= 12; n++) {
      const a = (n / 12) * Math.PI * 2;
      ctx.fillText(String(n), cx + Math.sin(a) * (r - 36), cy - Math.cos(a) * (r - 36));
    }
  }

  const d = scene.date;
  const sec = d.getSeconds();
  const min = d.getMinutes() + sec / 60;
  const hr = (d.getHours() % 12) + min / 60;
  const hand = (angle: number, len: number, width: number, stroke: string) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - Math.sin(angle) * 14, cy + Math.cos(angle) * 14);
    ctx.lineTo(cx + Math.sin(angle) * len, cy - Math.cos(angle) * len);
    ctx.stroke();
  };
  hand((hr / 12) * Math.PI * 2, r * 0.5, 7, color);
  hand((min / 60) * Math.PI * 2, r * 0.75, 5, color);
  hand((sec / 60) * Math.PI * 2, r * 0.85, 2, '#FF6B6B');
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  if (scene.sub) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6;
    fitFont(ctx, scene.sub, uiFamily, 400, W * 0.85, 24);
    ctx.fillText(scene.sub, cx, cy + r + 26);
    ctx.globalAlpha = 1;
  }
}

/* ═══════════════════════════════════════════════════════════════ */

/** Document Picture-in-Picture (Chrome / Edge 116+) — fenêtre HTML sans contrôles vidéo */
interface DocPipApi {
  requestWindow(opts?: { width?: number; height?: number }): Promise<Window>;
  window: Window | null;
}
function getDocPip(): DocPipApi | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { documentPictureInPicture?: DocPipApi }).documentPictureInPicture ?? null;
}

/** Rendu 2× pour un affichage net */
const SCALE = 2;

export function usePictureInPicture(getScene: () => PipScene, style: PipStyle) {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);

  const sceneRef = useRef(getScene);
  const styleRef = useRef(style);
  sceneRef.current = getScene;
  styleRef.current = style;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pipWindowRef = useRef<Window | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const videoPip =
      !!document.pictureInPictureEnabled &&
      'captureStream' in HTMLCanvasElement.prototype;
    setSupported(typeof Worker !== 'undefined' && (!!getDocPip() || videoPip));
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    try {
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      drawScene(ctx, sceneRef.current(), styleRef.current);
      // Fond de la fenêtre assorti (bandes si la fenêtre n'est pas en 16:9)
      const win = pipWindowRef.current;
      const bg = styleRef.current.background;
      if (win) win.document.body.style.background = bg && !bg.includes('url(') ? bg : '#0A0A0A';
    } catch { /* noop */ }
  }, []);

  const teardown = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    const video = videoRef.current;
    if (video) {
      (video.srcObject as MediaStream | null)?.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
      video.remove();
    }
    videoRef.current = null;
    pipWindowRef.current = null;
    canvasRef.current = null;
    setActive(false);
  }, []);

  const open = useCallback(async () => {
    if (videoRef.current || pipWindowRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    canvasRef.current = canvas;
    render();

    const startTicking = () => {
      const worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' })));
      worker.onmessage = render;
      worker.postMessage(TICK_MS);
      workerRef.current = worker;
    };

    /* ── 1. Document PiP : fenêtre propre, sans barre ni boutons vidéo ── */
    const docPip = getDocPip();
    if (docPip) {
      try {
        const win = await docPip.requestWindow({ width: 360, height: 203 });
        pipWindowRef.current = win;
        win.document.title = 'horloge-live.com';
        Object.assign(win.document.body.style, {
          margin: '0', overflow: 'hidden', background: '#0A0A0A',
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
        });
        Object.assign(canvas.style, { width: '100%', height: '100%', objectFit: 'contain', display: 'block' });
        win.document.body.appendChild(canvas);
        win.addEventListener('pagehide', teardown, { once: true });
        startTicking();
        render();
        setActive(true);
        return;
      } catch {
        pipWindowRef.current = null; // repli sur le PiP vidéo
      }
    }

    /* ── 2. PiP vidéo (Safari, Chrome Android…) ── */
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
    // Dans le DOM mais invisible (Safari refuse le PiP d'une vidéo détachée)
    Object.assign(video.style, {
      position: 'fixed', width: '1px', height: '1px', opacity: '0',
      pointerEvents: 'none', bottom: '0', right: '0',
    });
    document.body.appendChild(video);
    videoRef.current = video;
    video.srcObject = canvas.captureStream(10);
    video.addEventListener('leavepictureinpicture', teardown, { once: true });
    startTicking();

    try {
      await video.play();
      await video.requestPictureInPicture();
      setActive(true);
    } catch {
      teardown();
    }
  }, [render, teardown]);

  const close = useCallback(() => {
    if (pipWindowRef.current) {
      pipWindowRef.current.close();
    } else if (videoRef.current && document.pictureInPictureElement === videoRef.current) {
      document.exitPictureInPicture().catch(() => {});
    }
  }, []);

  const toggle = useCallback(() => {
    if (pipWindowRef.current || (videoRef.current && document.pictureInPictureElement === videoRef.current)) {
      close();
    } else {
      open();
    }
  }, [open, close]);

  /* Quitter la page (changement de mode) → fermer la fenêtre */
  useEffect(() => () => {
    close();
    teardown();
  }, [close, teardown]);

  return { supported, active, toggle };
}

/* ── Formatage partagé ───────────────────────────────────────── */

const pad = (n: number) => String(n).padStart(2, '0');

/** « 14:05 », « 14:05:09 » ou « 2:05 PM » */
export function pipClockText(date: Date, format: '12h' | '24h', showSeconds: boolean): string {
  const m = pad(date.getMinutes());
  const s = showSeconds ? `:${pad(date.getSeconds())}` : '';
  if (format === '12h') {
    const h = date.getHours() % 12 || 12;
    return `${h}:${m}${s} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
  }
  return `${pad(date.getHours())}:${m}${s}`;
}

/** « mercredi 12 novembre » */
export function pipDateText(date: Date, language: 'fr' | 'en'): string {
  return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

/** Durée : « 05:12.3 » (dixièmes) ou « 1:05:12 » */
export function pipDurationText(ms: number, opts: { tenths?: boolean; ceil?: boolean } = {}): string {
  const v = Math.max(0, ms);
  const totalS = opts.ceil ? Math.ceil(v / 1000) : Math.floor(v / 1000);
  const h = Math.floor(totalS / 3600);
  const m = Math.floor((totalS % 3600) / 60);
  const s = totalS % 60;
  const base = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  return opts.tenths ? `${base}.${Math.floor((v % 1000) / 100)}` : base;
}
