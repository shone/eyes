self.addEventListener('install', event => {
	event.waitUntil(async function installWaitUntil() {
		// Cache everything the app should need to run offline
		const cache = await caches.open('static-assets-v1');
		await cache.addAll([
			'./index.html',
			'./manifest.webmanifest',
			'./icon_64x64.png',
			'./icon_192x192.png',
			'./icon_512x512.png',
		]);
	}());
});

self.addEventListener('fetch', event => {
	event.respondWith(async function fetchRespondWith() {
		// Try to fetch over the network, but if that fails get it from the cache.
		const cache = await caches.open('static-assets-v1');
		try {
			const networkResponse = await fetch(event.request);
			cache.put(event.request, networkResponse.clone());
			return networkResponse;
		} catch (error) {
			return cache.match(event.request);
		}
	}());
});
