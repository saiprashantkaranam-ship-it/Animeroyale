/**
 * ANIME ROYALE - MAIN ENTRY POINT
 */

import { initRouter } from './router.js';
import { subscribe } from './state.js';
import { initStorage } from './storage.js';
import { initCards } from './cards.js';

// Initialize the game
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Anime Royale...');
    
    // Initialize data pools
    initCards();

    // Initialize storage (Loads local data + Firebase sync)
    await initStorage();

    // Subscribe to state changes if needed for global logging or updates
    subscribe((newState) => {
        // console.log('State updated:', newState.currentScreen);
    });

    // Initialize router and show first screen
    initRouter();
});

// Handle window errors for better debugging
window.onerror = function(msg, url, line, col, error) {
    console.error('Game Error:', msg, 'at', line, ':', col);
    return false;
};
