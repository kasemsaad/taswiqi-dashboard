// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB2pRuq3eF_2jC9k9d4dcKP0XGwrf-KCRg",
  authDomain: "taswiqi-c0b96.firebaseapp.com",
  projectId: "taswiqi-c0b96",
  storageBucket: "taswiqi-c0b96.firebasestorage.app",
  messagingSenderId: "904888147619",
  appId: "1:904888147619:web:55987edd61939026f0a916",
  measurementId: "G-FQE17RSC08"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/logo.png' // يمكنك تخصيص الأيقونة
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
