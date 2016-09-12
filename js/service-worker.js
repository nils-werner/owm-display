/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './', // Alias for index.html
  'js/service-worker.js',
  'js/screensaver.js',
  'js/loader.js',
  'js/jquery-1.9.1.min.js',
  'js/highcharts.js',
  'js/highcharts-more.js',
  'js/dark-unica.js',
  'js/charts.js',
  'css/style.css',
  'css/bootstrap.min.css',
  'img/screenshot.png',
  'img/map-pin.png',
  'img/map-mask.png',
  'img/daytime.png',
  'img/background.png',
  'img/weather/thunderstorms.png',
  'img/weather/sunny.png',
  'img/weather/snow.png',
  'img/weather/slightdrizzle.png',
  'img/weather/mostlycloudy.png',
  'img/weather/moon.png',
  'img/weather/haze.png',
  'img/weather/drizzlesnow.png',
  'img/weather/drizzle.png',
  'img/weather/cloudynight.png',
  'img/weather/cloudy.png',
  'img/favicon/mstile-70x70.png',
  'img/favicon/mstile-310x310.png',
  'img/favicon/mstile-310x150.png',
  'img/favicon/mstile-150x150.png',
  'img/favicon/mstile-144x144.png',
  'img/favicon/generate.py',
  'img/favicon/favicon.orig.png',
  'img/favicon/favicon.ico',
  'img/favicon/favicon-96x96.png',
  'img/favicon/favicon-32x32.png',
  'img/favicon/favicon-16x16.png',
  'img/favicon/apple-touch-icon.png',
  'img/favicon/apple-touch-icon-precomposed.png',
  'img/favicon/apple-touch-icon-76x76.png',
  'img/favicon/apple-touch-icon-72x72.png',
  'img/favicon/apple-touch-icon-60x60.png',
  'img/favicon/apple-touch-icon-57x57.png',
  'img/favicon/apple-touch-icon-180x180.png',
  'img/favicon/apple-touch-icon-152x152.png',
  'img/favicon/apple-touch-icon-144x144.png',
  'img/favicon/apple-touch-icon-120x120.png',
  'img/favicon/apple-touch-icon-114x114.png',
  'img/favicon/android-chrome-96x96.png',
  'img/favicon/android-chrome-72x72.png',
  'img/favicon/android-chrome-512x512.png',
  'img/favicon/android-chrome-48x48.png',
  'img/favicon/android-chrome-384x384.png',
  'img/favicon/android-chrome-36x36.png',
  'img/favicon/android-chrome-256x256.png',
  'img/favicon/android-chrome-192x192.png',
  'img/favicon/android-chrome-144x144.png',
  'img/directions/wsw.png',
  'img/directions/wnw.png',
  'img/directions/w.png',
  'img/directions/sw.png',
  'img/directions/ssw.png',
  'img/directions/sse.png',
  'img/directions/se.png',
  'img/directions/s.png',
  'img/directions/nw.png',
  'img/directions/nnw.png',
  'img/directions/nne.png',
  'img/directions/ne.png',
  'img/directions/n.png',
  'img/directions/ese.png',
  'img/directions/ene.png',
  'img/directions/e.png',
  'img/directions/arrow.png'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(RUNTIME).then(cache => {
        return fetch(event.request).then(response => {
          // Put a copy of the response in the runtime cache.
          return cache.put(event.request, response.clone()).then(() => {
            return response;
          });
        });
      });
    })
  );
});
