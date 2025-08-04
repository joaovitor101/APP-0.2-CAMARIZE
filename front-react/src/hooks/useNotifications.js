import { useState, useEffect, useCallback } from 'react';

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permission, setPermission] = useState('default');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se o navegador suporta notificações push
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 
                       'PushManager' in window && 
                       'Notification' in window;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
      }
    };
    
    checkSupport();
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registrado:', registration);
        return registration;
      }
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
      throw error;
    }
  }, []);

  // Solicitar permissão para notificações
  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!isSupported) {
        throw new Error('Notificações push não são suportadas neste navegador');
      }

      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        console.log('✅ Permissão para notificações concedida!');
        return true;
      } else {
        console.log('❌ Permissão para notificações negada');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Inscrever para notificações push
  const subscribeToPush = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!isSupported) {
        throw new Error('Notificações push não são suportadas');
      }

      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Permissão necessária para notificações');
        }
      }

      // Registrar Service Worker
      const registration = await registerServiceWorker();
      
      // Verificar se já está inscrito
      let existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        console.log('✅ Já inscrito para notificações push');
        setSubscription(existingSubscription);
        setIsSubscribed(true);
        return existingSubscription;
      }

      // Gerar chave VAPID (Você precisará configurar isso no servidor)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
                            'BEl62iUYgUivxIkv69yViEuiBIa1lQzK7WqCJfagKShFGiExuFy4XwsMMtXjQ0FEizxg3L_YmWWRSxef5jYAlz8';
      
      // Converter chave VAPID para Uint8Array
      const vapidPublicKeyArray = urlBase64ToUint8Array(vapidPublicKey);

      // Inscrever para push
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKeyArray
      });

      console.log('✅ Inscrito para notificações push:', newSubscription);
      
      // Enviar subscription para o servidor
      await sendSubscriptionToServer(newSubscription);
      
      setSubscription(newSubscription);
      setIsSubscribed(true);
      
      return newSubscription;
      
    } catch (error) {
      console.error('❌ Erro ao inscrever para push:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission, requestPermission, registerServiceWorker]);

  // Cancelar inscrição
  const unsubscribeFromPush = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (subscription) {
        await subscription.unsubscribe();
        console.log('✅ Inscrição cancelada');
        
        // Remover subscription do servidor
        await removeSubscriptionFromServer(subscription);
        
        setSubscription(null);
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('❌ Erro ao cancelar inscrição:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  // Enviar subscription para o servidor
  const sendSubscriptionToServer = async (subscription) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${apiUrl}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: localStorage.getItem("userId"),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar subscription para o servidor');
      }

      console.log('✅ Subscription enviada para o servidor');
    } catch (error) {
      console.error('❌ Erro ao enviar subscription:', error);
      throw error;
    }
  };

  // Remover subscription do servidor
  const removeSubscriptionFromServer = async (subscription) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${apiUrl}/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: localStorage.getItem("userId")
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao remover subscription do servidor');
      }

      console.log('✅ Subscription removida do servidor');
    } catch (error) {
      console.error('❌ Erro ao remover subscription:', error);
      throw error;
    }
  };

  // Verificar status da inscrição
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          setSubscription(subscription);
          setIsSubscribed(true);
          console.log('✅ Inscrição ativa encontrada');
        } else {
          setIsSubscribed(false);
          console.log('ℹ️ Nenhuma inscrição ativa');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar status da inscrição:', error);
    }
  }, []);

  // Verificar status na inicialização
  useEffect(() => {
    if (isSupported) {
      checkSubscriptionStatus();
    }
  }, [isSupported, checkSubscriptionStatus]);

  // Testar notificação local
  const testNotification = useCallback(async () => {
    try {
      if (permission !== 'granted') {
        throw new Error('Permissão necessária para notificações');
      }

      const notification = new Notification('Camarize - Teste', {
        body: 'Esta é uma notificação de teste do Camarize!',
        icon: '/images/logo_camarize1.png',
        badge: '/images/logo_camarize1.png',
        tag: 'test-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'Ver Detalhes'
          },
          {
            action: 'dismiss',
            title: 'Fechar'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      console.log('✅ Notificação de teste enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de teste:', error);
      throw error;
    }
  }, [permission]);

  return {
    // Estados
    isSupported,
    isSubscribed,
    subscription,
    permission,
    isLoading,
    
    // Funções
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    testNotification,
    checkSubscriptionStatus,
    registerServiceWorker
  };
};

// Função auxiliar para converter chave VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 