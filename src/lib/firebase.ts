import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAm4jMQclEyeZjmsQTRDXEoYpEVfvLDb-o',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'student-club-a4a17.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'student-club-a4a17',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'student-club-a4a17.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '492048828715',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:492048828715:web:6285833341d22455811d6e',
};

// Initialize Firebase App (singleton-safe for Next.js hot-reload)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with long polling support for robust connectivity
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch (_) {
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;
