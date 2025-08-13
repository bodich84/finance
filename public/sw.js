const CACHE_NAME = 'my-app-cache-v1'
const ASSETS_TO_CACHE = [
  '/', // головна
  '/index.html', // html
  '/manifest.json', // маніфест
  '/favicon.ico', // іконка
  '/logo192.png', // іконки PWA
  '/logo512.png',
]

// Встановлення SW та кешування статичних ресурсів
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  )
})

// Активація SW і видалення старих кешів
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key)
            }
          })
        )
      )
      .then(() => self.clients.claim())
  )
})

// Перехоплення запитів (offline-first для статичних файлів)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse // якщо є в кеші
      }
      return fetch(event.request) // інакше з мережі
    })
  )
})
