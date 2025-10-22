// // Firebase App (the core Firebase SDK) is always required
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase } from 'firebase/database';
// import { getAnalytics } from 'firebase/analytics';
// import firebaseConfig from './config';
//
// // Initialize Firebase
// let firebaseApp;
//
// // Check if Firebase app is already initialized to avoid duplicate initialization
// if (!getApps().length) {
//   firebaseApp = initializeApp(firebaseConfig);
// } else {
//   firebaseApp = getApp();
// }
//
// // Initialize Firebase services
// export const auth = getAuth(firebaseApp);
// export const db = getDatabase(firebaseApp);

//
// // Initialize Analytics only in client-side and if measurementId exists
// let analytics;
// if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
//   analytics = getAnalytics(firebaseApp);
// }
//
// export { analytics };
// export default firebaseApp;


// Firebase App (the core Firebase SDK) is always required
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage'; // ✅ Import getStorage
import firebaseConfig from './config';

// Initialize Firebase
let firebaseApp;

// Check if Firebase app is already initialized to avoid duplicate initialization
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Initialize Firebase services
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp); // ✅ Initialize storage

// Initialize Analytics only in client-side and if measurementId exists
let analytics;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  analytics = getAnalytics(firebaseApp);
}

export { analytics };
export default firebaseApp;
