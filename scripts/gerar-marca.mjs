// Gera favicon-32.png, apple-touch-icon.png e og-image.jpg a partir do ícone do app
// (quadrado preto arredondado com o símbolo de energia em verde-menta, #2ec4a6).
// Uso: npm run marca
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const favicon = readFileSync('public/favicon.svg');
await sharp(favicon, { density: 600 }).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(favicon, { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');

const MENTA = '#2ec4a6';
const marca = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="none">
    <rect width="32" height="32" rx="7.2" fill="#000" stroke="#2f3a37" stroke-width="0.6"/>
    <g stroke="${MENTA}" stroke-width="2.5" stroke-linecap="round">
      <path d="M16 7.6v7.6"/><path d="M20.8 12.9A7.2 7.2 0 1 1 11.2 12.9"/>
    </g>
  </g>`;

// anel de contagem regressiva (o gesto da página), fechado
const anel = (cx, cy, r) => {
  const c = 2 * Math.PI * r;
  return `<g transform="rotate(-90 ${cx} ${cy})">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#26302d" stroke-width="22"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${MENTA}" stroke-width="22" stroke-linecap="round" stroke-dasharray="${c * 0.82} ${c}"/>
  </g>`;
};
const fonte = 'font-family="Segoe UI, Arial, Helvetica, sans-serif"';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0e0d"/>
  <rect width="1200" height="12" fill="${MENTA}"/>
  ${marca(80, 70, 2.5)}
  <text x="180" y="128" ${fonte} font-size="48" font-weight="800" fill="#e9eeec">desliga-remoto</text>
  <text x="80" y="318" ${fonte} font-size="78" font-weight="800" fill="#e9eeec">O PC desliga</text>
  <text x="80" y="408" ${fonte} font-size="78" font-weight="800" fill="${MENTA}">na hora certa.</text>
  <text x="80" y="510" ${fonte} font-size="32" font-weight="600" fill="#a8b3af">Agenda o desligamento do PC e controla a energia</text>
  <text x="80" y="552" ${fonte} font-size="32" font-weight="600" fill="#a8b3af">pelo celular. App para Windows, em desenvolvimento.</text>
  ${anel(930, 330, 130)}
  <text x="930" y="345" ${fonte} font-size="54" font-weight="800" fill="#e9eeec" text-anchor="middle">23:30</text>
  <text x="930" y="385" ${fonte} font-size="24" font-weight="600" fill="#a8b3af" text-anchor="middle">exemplo</text>
</svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile('public/og-image.jpg');
console.log('marca gerada');
