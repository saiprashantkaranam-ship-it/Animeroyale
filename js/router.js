/**
 * ANIME ROYALE - SCREEN ROUTER
 */

import { reactiveState } from './state.js';
import * as UI from './ui.js';

const screens = {
    'main-menu': UI.renderMainMenu,
    'battle-selection': UI.renderBattleSelection,
    'deck-builder': UI.renderDeckBuilder,
    'card-collection': UI.renderCardCollection,
    'profile': UI.renderProfile,
    'shop': UI.renderShop,
    'settings': UI.renderSettings,
    'battle': UI.renderBattle,
    'battle-end': UI.renderBattleEnd,
    'admin-panel': UI.renderAdminPanel
};

export function navigateTo(screenId) {
    const container = document.getElementById('screen-container');
    if (!container) return;

    const renderFunc = screens[screenId];
    if (renderFunc) {
        reactiveState.currentScreen = screenId;
        
        // Clear container and render new screen
        container.innerHTML = '';
        const screenElement = renderFunc();
        container.appendChild(screenElement);
        
        // Scroll to top
        window.scrollTo(0, 0);
    } else {
        console.error(`Screen not found: ${screenId}`);
    }
}

// Initial route
export function initRouter() {
    navigateTo(reactiveState.currentScreen);
}
