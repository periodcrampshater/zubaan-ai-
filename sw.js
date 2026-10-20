
"use strict";

const CACHE_NAME = "zubaan-ai-shell-v6";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg"
];

// Install the new version and cache the app shell.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// Remove outdated caches when this version activates.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Keep AI API requests online-only; never cache their responses.
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes("/.netlify/functions/")) return;

  // For page navigation, prefer the latest version from the network.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put("./index.html", copy))
              .catch(() => {});
          }

          return response;
        })
        .catch(async () => {
          return (
            await caches.match("./index.html")
          ) || Response.error();
        })
    );

    return;
  }

  // For app assets, use the network first and fall back to cache.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, copy))
            .catch(() => {});
        }

        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        return cached || Response.error();
      })
  );
});
