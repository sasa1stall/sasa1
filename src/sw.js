import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

self.skipWaiting();
clientsClaim();

// Precache resources
precacheAndRoute(self.__WB_MANIFEST);

// -------------------------------------------------------------
// Push Notification Logic
// -------------------------------------------------------------

self.addEventListener('push', (event) => {
    let data = {};
    if (event.data) {
        data = JSON.parse(event.data.text());
    }

    const title = data.title || 'New Notification';
    const options = {
        body: data.body || 'You have a new update.',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        vibrate: [2000, 500, 2000, 500, 2000, 500, 2000, 500], // Vibrate for 2 seconds (x4)
        tag: 'order-notification',
        renotify: true,           // Buzz again if another order comes
        requireInteraction: true, // Keeps notification active until user clicks
        data: { url: data.url || '/' }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If the URL is already open, focus it
            const urlToOpen = event.notification.data.url;
            
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
