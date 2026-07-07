importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialized with real Firebase credentials to match the client config
firebase.initializeApp({
  apiKey: "AIzaSyDHgpEn9XHwbO8yeB9ccJtzaAli55VQfr0",
  authDomain: "theaskt.firebaseapp.com",
  projectId: "theaskt",
  storageBucket: "theaskt.firebasestorage.app",
  messagingSenderId: "828901237289",
  appId: "1:828901237289:web:0a2a04b3d527f8377ab238",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'New Opportunity Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'Check out the details on TheAskt.',
    icon: '/logo.png',
    data: {
      clickUrl: payload.data?.clickUrl || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
