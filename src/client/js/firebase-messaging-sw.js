// firebase-messaging-sw.js
import * as firebase from 'firebase/app';
import 'firebase/messaging';

firebase.initializeApp({
    messagingSenderId: process.env.FIREBASE_CONFIG.MESSAGE_SENDER_ID
});

const messaging = firebase.messaging();
