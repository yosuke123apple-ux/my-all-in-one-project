// キャッシュ名
const CACHE_NAME = "task-app-cache-v1";

// キャッシュしたいファイルを指定
const urlsToCache = [
  "/index.html",
  "/style.css",
  "/dist/test.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// インストール時にキャッシュに保存
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// リクエスト時にキャッシュ優先
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
