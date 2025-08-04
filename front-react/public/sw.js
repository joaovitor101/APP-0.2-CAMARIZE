// Service Worker para Camarize - Notificações Push e Cache Offline
const CACHE_NAME = 'camarize-v1.0.0';
const STATIC_CACHE = 'camarize-static-v1.0.0';
const DYNAMIC_CACHE = 'camarize-dynamic-v1.0.0';

// URLs para cache estático
const STATIC_URLS = [
  '/',
  '/home',
  '/dashboard',
  '/status-cativeiros',
  '/sensores',
  '/notifications',
  '/profile',
  '/settings',
  '/images/logo_camarize1.png',
  '/images/logo_camarize2.png',
  '/images/bg.png',
  '/images/loading.gif'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('🦐 Camarize Service Worker instalado!');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Cache estático aberto');
        return cache.addAll(STATIC_URLS);
      })
      .then(() => {
        console.log('✅ Cache estático populado');
        return self.skipWaiting();
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Camarize Service Worker ativado!');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Caches antigos removidos');
        return self.clients.claim();
      })
  );
});

// Interceptação de requisições para cache offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estratégia: Cache First para recursos estáticos
  if (request.method === 'GET' && STATIC_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((fetchResponse) => {
              return caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
    );
  }
  
  // Estratégia: Network First para APIs
  else if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache apenas respostas bem-sucedidas
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback para cache se offline
          return caches.match(request);
        })
    );
  }
});

// Recebimento de notificações push
self.addEventListener('push', (event) => {
  console.log('📱 Notificação push recebida!');
  
  let notificationData = {
    title: 'Camarize',
    body: 'Nova notificação do sistema',
    icon: '/images/logo_camarize1.png',
    badge: '/images/logo_camarize1.png',
    tag: 'camarize-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Ver Detalhes',
        icon: '/images/logo_camarize1.png'
      },
      {
        action: 'dismiss',
        title: 'Fechar',
        icon: '/images/logo_camarize1.png'
      }
    ],
    data: {
      url: '/notifications',
      timestamp: Date.now()
    }
  };
  
  // Se há dados específicos na notificação
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData
      };
    } catch (error) {
      console.log('Erro ao processar dados da notificação:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notificação clicada:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Abrir a página de notificações
    event.waitUntil(
      clients.openWindow('/notifications')
    );
  } else if (event.action === 'dismiss') {
    // Apenas fechar a notificação
    console.log('Notificação descartada');
  } else {
    // Clique padrão - abrir app
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Se já há uma janela aberta, focar nela
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // Se não há janela aberta, abrir nova
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Fechamento de notificação
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notificação fechada');
  
  // Aqui você pode enviar analytics sobre notificações fechadas
  const notificationData = {
    type: 'notification_closed',
    timestamp: Date.now(),
    notificationId: event.notification.tag
  };
  
  // Enviar para analytics (se implementado)
  // self.registration.pushManager.getSubscription()
  //   .then(subscription => {
  //     if (subscription) {
  //       fetch('/api/analytics/notification', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(notificationData)
  //       });
  //     }
  //   });
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('🔄 Sincronização em background:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sincronizar dados offline quando conexão voltar
      syncData()
    );
  }
});

// Função para sincronizar dados
async function syncData() {
  try {
    // Aqui você pode implementar sincronização de dados offline
    console.log('🔄 Sincronizando dados...');
    
    // Exemplo: enviar dados salvos offline
    // const offlineData = await getOfflineData();
    // if (offlineData.length > 0) {
    //   await sendOfflineData(offlineData);
    // }
    
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
}

console.log('🦐 Camarize Service Worker carregado!'); 