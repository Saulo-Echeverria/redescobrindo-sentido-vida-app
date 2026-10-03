// ===== SERVICE WORKER — Redescobrindo o Sentido da Vida =====
// Estratégia: Cache-First para assets estáticos, Network-First para dados

const APP_VERSION = 'v1.0.5';
const CACHE_STATIC = `rsv-static-${APP_VERSION}`;
const CACHE_DYNAMIC = `rsv-dynamic-${APP_VERSION}`;

// Assets que SEMPRE devem estar em cache (shell do app)
const STATIC_ASSETS = [
  '/index.html',
  '/style.css',
  '/app.js',
  '/data.js',
  '/pdf-export.js',
  '/achievements.js',
  '/quotes.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Google Fonts (fallback offline)
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// ── INSTALL: pré-cacheia o shell do app ──────────────────────────────────────
self.addEventListener('install', event => {
  console.log(`[SW] Installing ${APP_VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[SW] Pre-caching static assets...');
        // Cacheia cada asset individualmente para não falhar tudo se um falhar
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(err =>
              console.warn(`[SW] Failed to cache: ${url}`, err)
            )
          )
        );
      })
      .then(() => {
        console.log('[SW] Static assets cached.');
        return self.skipWaiting(); // Ativa imediatamente sem esperar fechar abas
      })
  );
});

// ── ACTIVATE: limpa caches antigos ──────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log(`[SW] Activating ${APP_VERSION}...`);
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
            .map(key => {
              console.log(`[SW] Deleting old cache: ${key}`);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned.');
        return self.clients.claim(); // Assume controle de todas as abas abertas
      })
  );
});

// ── FETCH: estratégia de cache por tipo de recurso ──────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-GET e extensões de browser
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.protocol === 'moz-extension:') return;

  // Estratégia 1: Cache-First para assets estáticos do app
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estratégia 2: Stale-While-Revalidate para Google Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Estratégia 3: Network-First para tudo mais (com fallback para cache)
  event.respondWith(networkFirst(request));
});

// ── ESTRATÉGIAS DE CACHE ─────────────────────────────────────────────────────

// Cache-First: serve do cache, só vai à rede se não tiver
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Cache-First fetch failed:', err);
    return offlineFallback(request);
  }
}

// Network-First: tenta rede, cai para cache se offline
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_DYNAMIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return offlineFallback(request);
  }
}

// Stale-While-Revalidate: serve cache imediatamente, atualiza em background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_DYNAMIC);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || fetchPromise;
}

// Fallback offline: retorna o index.html para navegação SPA
async function offlineFallback(request) {
  const url = new URL(request.url);
  if (request.headers.get('accept')?.includes('text/html')) {
    const cached = await caches.match('/index.html');
    if (cached) return cached;
  }
  return new Response(
    JSON.stringify({ error: 'Offline', message: 'Sem conexão com a internet' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  );
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

function isStaticAsset(url) {
  const staticExtensions = ['.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'];
  const isSameOrigin = url.origin === self.location.origin;
  const hasStaticExt = staticExtensions.some(ext => url.pathname.endsWith(ext));
  return isSameOrigin && hasStaticExt;
}

// ── BACKGROUND SYNC (para salvar dados offline) ──────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-progress') {
    console.log('[SW] Background sync: syncing progress data...');
    // Aqui você pode implementar sync com backend no futuro
  }
});

// ── PUSH NOTIFICATIONS (lembretes de prática) ────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Continue sua jornada de autodescoberta.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/index.html' },
    actions: [
      { action: 'open', title: '▶ Continuar Jornada' },
      { action: 'dismiss', title: 'Mais tarde' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Redescobrindo o Sentido da Vida',
      options
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});

// ── MENSAGENS DO APP ─────────────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: APP_VERSION });
  }
});

console.log(`[SW] Service Worker ${APP_VERSION} loaded.`);