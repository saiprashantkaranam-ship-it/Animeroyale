/**
 * ANIME ROYALE - STORAGE & SYNC ENGINE
 * Handles LocalStorage (instant) and Firebase (sync)
 */

import { db } from './firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { reactiveState } from './state.js';

const STORAGE_KEY = 'anime_royale_player_data';
let lastSyncTime = Date.now();
const SYNC_INTERVAL = 60000; // 60 seconds

/**
 * Initialize Storage
 */
export async function initStorage() {
    // 1. Load from LocalStorage first (Instant)
    const localData = loadFromLocal();
    if (localData) {
        Object.assign(reactiveState.player, localData);
        console.log('Loaded from LocalStorage');
    }

    // 2. Check for User ID (Create if new)
    if (!localStorage.getItem('ar_user_id')) {
        const newUid = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ar_user_id', newUid);
    }

    const uid = localStorage.getItem('ar_user_id');

    // 3. Sync with Firebase (Cloud Backup)
    await loadFromFirebase(uid);

    // 4. Start Auto-Sync Timer
    setInterval(() => {
        if (Date.now() - lastSyncTime >= SYNC_INTERVAL) {
            syncToFirebase();
        }
    }, 10000); // Check every 10s

    // 5. Force Save on Exit
    window.addEventListener('beforeunload', () => {
        saveToLocal();
        syncToFirebase(true); // Attempt a synchronous-like save
    });
}

/**
 * Save to Browser LocalStorage
 */
export function saveToLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reactiveState.player));
    localStorage.setItem(STORAGE_KEY + '_ts', Date.now().toString());
}

/**
 * Load from Browser LocalStorage
 */
function loadFromLocal() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Load from Firebase (Cloud Source of Truth)
 */
async function loadFromFirebase(uid) {
    try {
        const docRef = doc(db, "players", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const firebaseData = docSnap.data();
            const localTs = parseInt(localStorage.getItem(STORAGE_KEY + '_ts') || '0');
            const firebaseTs = firebaseData.lastUpdated || 0;

            // Only overwrite local if Firebase is newer
            if (firebaseTs > localTs) {
                Object.assign(reactiveState.player, firebaseData);
                saveToLocal();
                console.log('Synchronized from Firebase (Cloud is newer)');
            }
        } else {
            console.log('No cloud profile found, creating one...');
            await syncToFirebase();
        }
    } catch (error) {
        console.error("Error loading from Firebase:", error);
    }
}

/**
 * Push to Firebase
 */
export async function syncToFirebase(isForced = false) {
    const uid = localStorage.getItem('ar_user_id');
    if (!uid) return;

    try {
        const docRef = doc(db, "players", uid);
        const dataToSave = {
            ...reactiveState.player,
            lastUpdated: Date.now()
        };

        await setDoc(docRef, dataToSave);
        lastSyncTime = Date.now();
        console.log('Synced to Firebase successfully');
    } catch (error) {
        console.error("Firebase Sync Error:", error);
    }
}
