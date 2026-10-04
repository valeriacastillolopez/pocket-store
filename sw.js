const CACHE_SHELL = 'pocketstore-shell-v1';
const CACHE_DATOS = 'pocketstore-datos-v1';

const ARCHIVOS_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

//se guarda el app shell enel cache
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando…');
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then((cache) => cache.addAll(ARCHIVOS_SHELL))
      .then(() => self.skipWaiting())
  );
});

// borrar cache viejo
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado');
  event.waitUntil(
    caches.keys()
      .then((nombres) =>
        Promise.all(
          nombres
            .filter((n) => n !== CACHE_SHELL && n !== CACHE_DATOS)
            .map((n) => caches.delete(n))
        )
      )
      .then(() => self.clients.claim())
  );
});

//intercepta todas las peticiones
self.addEventListener('fetch', (event) => {
  const peticion = event.request;

  // Solo se manejan peticiones GET
  if (peticion.method !== 'GET') return;

  const url = new URL(peticion.url);

  // Datos de la API
  if (url.hostname === 'jsonplaceholder.typicode.com') {
    event.respondWith(redPrimero(peticion));
    return;
  }

  // sik no hay red primero cache
  event.respondWith(cachePrimero(peticion));
});

async function cachePrimero(peticion) {
  const enCache = await caches.match(peticion);
  if (enCache) return enCache;

  try {
    const respuesta = await fetch(peticion);
    const cache = await caches.open(CACHE_SHELL);
    cache.put(peticion, respuesta.clone());
    return respuesta;
  } catch (error) {
    if (peticion.mode === 'navigate') {
      return caches.match('./index.html');
    }
    return new Response('Sin conexión', { status: 503 });
  }
}

// red primero
async function redPrimero(peticion) {
  try {
    const respuesta = await fetch(peticion);
    const cache = await caches.open(CACHE_DATOS);
    cache.put(peticion, respuesta.clone());
    return respuesta;
  } catch (error) {
    const enCache = await caches.match(peticion);
    if (enCache) return enCache;

    return new Response(JSON.stringify({ error: 'Sin conexión y sin datos guardados' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
