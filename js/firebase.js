/**
 * ANIME ROYALE - FIREBASE INITIALIZATION
 * Using Firebase v10 CDN (ES Modules)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "GOOGLE_API_KEY", // Placeholder or from environment
    authDomain: "animeroyale-b4e96.firebaseapp.com",
    projectId: "animeroyale-b4e96",
    storageBucket: "animeroyale-b4e96.firebasestorage.app",
    messagingSenderId: "564883243519",
    appId: "1:564883243519:web:fe28e25f43135f28c9a7ca",
    measurementId: "G-DD2138LVFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };
