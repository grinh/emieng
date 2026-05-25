/*
 * Firebase project configuration.
 * Replace the placeholder values below with your actual Firebase project settings
 * from https://console.firebase.google.com → Project Settings → General → Your apps.
 */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBYNbObVqY2GeDzs0xW8Lt4DSIkk7ErBt0",
    authDomain: "emieng-8ab16.firebaseapp.com",
    projectId: "emieng-8ab16",
    storageBucket: "emieng-8ab16.firebasestorage.app",
    messagingSenderId: "461239398592",
    appId: "1:461239398592:web:be4182b9d9b1d327393d25",
    measurementId: "G-0X43K6SPZJ"
  };

firebase.initializeApp(firebaseConfig);

const _db = firebase.firestore();
_db.enablePersistence({ synchronizeTabs: true }).catch(function (err) {
    if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence: multiple tabs open, only one can enable persistence.');
    } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence: browser does not support IndexedDB.');
    }
});
