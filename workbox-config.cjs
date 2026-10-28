// Service worker gerado depois do `expo export`: guarda todo o app para funcionar offline.
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,json,png,ico,svg,ttf,woff,woff2}'],
  globIgnores: ['sw.js', 'workbox-*.js'],
  swDest: 'dist/sw.js',
  navigateFallback: '/index.html',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
};
