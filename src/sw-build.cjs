// sw-build.js
const fs = require('fs');
const path = require('path');
require('dotenv').config()


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "gastroflow-91492.firebaseapp.com",
    projectId: "gastroflow-91492",
    storageBucket: "gastroflow-91492.firebasestorage.app",
    messagingSenderId: "199400500727",
    appId: "1:199400500727:web:070db59be62a4bc3ae52f2",
    measurementId: "G-3CS88ZDRZG"
};

const swContent = `
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.11.1/firebase-app-compat.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.11.1/firebase-messaging-compat.min.js");
const firebaseConfig = ${JSON.stringify(firebaseConfig)};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage (function(payload) {
    console.log(payload);
   
    const notification = JSON.parse(payload);
    const notificationOption = {
        body: notification.body,
        icon: notification.icon
    };
    return self.registration.showNotification(payload.notification.title, notificationOption);
});

    `;

fs.writeFileSync(path.join(__dirname, 'public', 'firebase-messaging-sw.js'), swContent);
