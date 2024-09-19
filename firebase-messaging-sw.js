importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyCiJqMxVSy-ww5xVMTr2cYBkUnemVYI7bY",
	authDomain: "car-rental-backend01.firebaseapp.com",
	databaseURL: "https://car-rental-backend01-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "car-rental-backend01",
	storageBucket: "car-rental-backend01.appspot.com",
	messagingSenderId: "630901504141",
	appId: "1:630901504141:web:36fc931b88ab779dc58ac4"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
