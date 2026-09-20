// Buildify Solutions - Firebase Cloud Services Core
// Initializes Firebase App, Firestore DB, and Firebase Cloud Storage

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const FIREBASE_CONFIG_KEY = 'buildify_firebase_config';

// Buildify Solutions Live Firebase Cloud Configuration
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAQXbgCi_NkcL-7hNNuCKswrNbF2q2UXOA",
  authDomain: "buildify-bdaeb.firebaseapp.com",
  projectId: "buildify-bdaeb",
  storageBucket: "buildify-bdaeb.firebasestorage.app",
  messagingSenderId: "900803773919",
  appId: "1:900803773919:web:b31b0f3594dfbd0842b06a"
};

/**
 * Retrieves the current Firebase configuration from default template, localStorage, or environment
 */
export function getFirebaseConfig() {
  // If DEFAULT_FIREBASE_CONFIG has the live key, use it as primary
  if (DEFAULT_FIREBASE_CONFIG.apiKey && DEFAULT_FIREBASE_CONFIG.apiKey.length > 15) {
    return DEFAULT_FIREBASE_CONFIG;
  }
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved Firebase config from localStorage:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Check if Firebase has been configured with valid keys
 */
export function isFirebaseConfigured() {
  const config = getFirebaseConfig();
  return Boolean(
    config.apiKey &&
    config.apiKey.length > 10 &&
    config.projectId &&
    !config.projectId.includes('your-project')
  );
}

let app = null;
let db = null;
let storage = null;

function initFirebaseServices() {
  const config = getFirebaseConfig();

  if (isFirebaseConfigured()) {
    try {
      if (!getApps().length) {
        app = initializeApp(config);
      } else {
        app = getApp();
      }
      db = getFirestore(app);
      storage = getStorage(app);
      console.log('🔥 Firebase initialized successfully for project:', config.projectId);
    } catch (error) {
      console.warn('⚠️ Firebase initialization notice:', error.message);
      app = null;
      db = null;
      storage = null;
    }
  } else {
    // Keys not yet entered
    app = null;
    db = null;
    storage = null;
  }
}

initFirebaseServices();

/**
 * Save new Firebase credentials (from Admin UI) and reinitialize services
 */
export function saveFirebaseConfig(newConfig) {
  try {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(newConfig));
    initFirebaseServices();
    return { success: true, isConfigured: isFirebaseConfigured() };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export { app, db, storage };
