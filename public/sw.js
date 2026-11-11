/* Jewellbox Club — Web Push service worker */
self.addEventListener('push', event => {
  let data = { title: 'Jewellbox Club', body: 'Payment reminder', url: '/contributions' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    try {
      data.body = event.data ? event.data.text() : data.body;
    } catch {
      /* ignore */
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Jewellbox Club', {
      body: data.body || 'Your monthly contribution is due soon.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: { url: data.url || '/contributions' },
      tag: data.tag || 'payment-reminder',
      renotify: true,
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/contributions';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
