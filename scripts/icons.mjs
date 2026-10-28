// Gera os ícones do app a partir de um SVG: `npm run icons`.
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

// Três barras (verde, creme, rosa) sobre o fundo escuro.
const svg = (fundo = true) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${fundo ? '<rect width="512" height="512" fill="#1A1719"/>' : ''}
  <rect x="122" y="236" width="68" height="160" rx="34" fill="#638C6A"/>
  <rect x="222" y="156" width="68" height="240" rx="34" fill="#F1EAE4"/>
  <rect x="322" y="116" width="68" height="280" rx="34" fill="#FF8EDD"/>
</svg>`;

const saidas = [
  ['public/icons/icon-192.png', 192],
  ['public/icons/icon-512.png', 512],
  ['public/icons/apple-touch-icon.png', 180],
  ['assets/images/icon.png', 1024],
  ['assets/images/favicon.png', 48],
];

await mkdir('public/icons', { recursive: true });
for (const [arquivo, tamanho] of saidas) {
  await sharp(Buffer.from(svg())).resize(tamanho, tamanho).png().toFile(arquivo);
}
await sharp(Buffer.from(svg(false))).resize(512, 512).png().toFile('assets/images/splash-icon.png');
console.log('Ícones gerados.');
