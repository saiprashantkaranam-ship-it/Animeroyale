/**
 * ANIME ROYALE - UI RENDERING ENGINE
 */

import { reactiveState } from './state.js';
import { navigateTo } from './router.js';
import { initAdminPanel } from './admin.js';
import { battleState, endTurn, startBattle } from './battle.js';

// --- HELPER FUNCTIONS ---

export function createElement(tag, props = {}, ...children) {
    const element = document.createElement(tag);
    
    for (const [key, value] of Object.entries(props)) {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'id') {
            element.id = value;
        } else if (key === 'onclick') {
            element.onclick = value;
        } else if (key.startsWith('on')) {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            element.setAttribute(key, value);
        }
    }

    for (const child of children) {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            element.appendChild(child);
        }
    }

    return element;
}

// --- SCREEN RENDERS ---

/**
 * MAIN MENU SCREEN
 */
export function renderMainMenu() {
    const screen = createElement('div', { className: 'screen-main-menu animate-fade-in' });

    // 1. Header Area (Top 30%)
    const header = createElement('div', { className: 'menu-header' },
        createElement('h1', { className: 'game-logo' }, 'ANIME ROYALE'),
        createElement('p', { className: 'game-subtitle' }, 'Battle with 100+ Anime Characters')
    );

    // 2. Main Content Area (Middle 40%) - 2x2 Grid
    const menuGrid = createElement('div', { className: 'menu-grid' },
        createMenuButton('⚔️ BATTLE', 'battle-selection', 'btn-primary'),
        createMenuButton('📚 CARDS', 'card-collection', 'btn-gold'),
        createMenuButton('👤 PROFILE', 'profile', 'btn-secondary'),
        createMenuButton('⚙️ SETTINGS', 'settings', 'btn-dark')
    );

    // 3. Bottom Area (Bottom 30%)
    const footer = createElement('div', { className: 'menu-footer glass-panel' },
        createElement('div', { className: 'player-info' },
            createElement('div', { className: 'avatar-circle' }, '👤'),
            createElement('div', { className: 'player-meta' },
                createElement('span', { className: 'player-name' }, reactiveState.player.name),
                createElement('span', { className: 'player-level' }, `Level ${reactiveState.player.level}`)
            )
        ),
        createElement('div', { className: 'resources' },
            createResourceItem('💰', `${reactiveState.player.gold.toLocaleString()} Gold`),
            createResourceItem('💎', `${reactiveState.player.gems.toLocaleString()} Gems`)
        )
    );

    screen.appendChild(header);
    screen.appendChild(menuGrid);
    screen.appendChild(footer);

    return screen;
}

function createMenuButton(label, targetScreen, colorClass) {
    return createElement('div', { className: 'menu-btn-wrapper' },
        createElement('button', { 
            className: `btn menu-btn ${colorClass}`,
            onclick: () => navigateTo(targetScreen)
        }, label)
    );
}

function createResourceItem(icon, text) {
    return createElement('div', { className: 'resource-item' },
        createElement('span', { className: 'resource-icon' }, icon),
        createElement('span', { className: 'resource-text' }, text)
    );
}

/**
 * SETTINGS SCREEN
 */
export function renderSettings() {
    const screen = createElement('div', { className: 'screen-settings animate-slide-up' },
        createElement('div', { className: 'header' },
            createElement('button', { className: 'btn-back', onclick: () => navigateTo('main-menu') }, '←'),
            createElement('h1', {}, 'SETTINGS')
        ),
        createElement('div', { className: 'settings-content glass-panel' },
            createElement('div', { className: 'settings-section' },
                createElement('h3', {}, 'Redeem Code'),
                createElement('div', { className: 'redeem-row' },
                    createElement('input', { type: 'text', id: 'redeem-input', placeholder: 'Enter Code...' }),
                    createElement('button', { 
                        className: 'btn btn-gold',
                        onclick: handleRedeem
                    }, 'REDEEM')
                ),
                createElement('p', { id: 'redeem-msg', className: 'hidden' }, '')
            ),
            createElement('div', { className: 'settings-section' },
                createElement('button', { 
                    className: 'btn btn-secondary',
                    onclick: () => {
                        localStorage.clear();
                        window.location.reload();
                    }
                }, 'Clear All Data')
            )
        )
    );

    if (reactiveState.isAdmin) {
        const adminBtn = createElement('button', {
            className: 'btn btn-gold admin-access-btn',
            onclick: () => navigateTo('admin-panel')
        }, 'Open Admin Panel');
        screen.querySelector('.settings-content').appendChild(adminBtn);
    }

    return screen;
}

function handleRedeem() {
    const input = document.getElementById('redeem-input');
    const msg = document.getElementById('redeem-msg');
    
    if (input.value === 'ADMIN143') {
        reactiveState.isAdmin = true;
        msg.textContent = 'Admin Mode Unlocked!';
        msg.className = 'success-text';
        navigateTo('settings'); // Refresh screen
    } else {
        msg.textContent = 'Invalid Code';
        msg.className = 'error-text';
    }
}

/**
 * ADMIN PANEL SCREEN
 */
export function renderAdminPanel() {
    const screen = createElement('div', { className: 'screen-admin animate-fade-in' },
        createElement('div', { className: 'admin-header glass-panel' },
            createElement('h1', { className: 'glowing-text-gold' }, 'ADMIN DASHBOARD'),
            createElement('button', { className: 'btn btn-secondary', onclick: () => navigateTo('settings') }, 'Exit Admin')
        ),
        createElement('div', { className: 'admin-layout' },
            createElement('div', { className: 'admin-sidebar glass-panel' },
                createElement('h3', {}, 'Cards'),
                createElement('div', { className: 'admin-card-list' }, 'No cards loaded yet.')
            ),
            createElement('div', { className: 'admin-editor glass-panel' },
                createElement('div', { className: 'editor-placeholder' }, 'Select a card to edit or create a new one.')
            )
        )
    );

    // Initialize Admin Logic
    setTimeout(() => initAdminPanel(screen), 0);

    return screen;
}

/**
 * CARD COLLECTION SCREEN
 */
export function renderCardCollection() {
    const screen = createElement('div', { className: 'screen-collection animate-fade-in' },
        createElement('div', { className: 'header' },
            createElement('button', { className: 'btn-back', onclick: () => navigateTo('main-menu') }, '←'),
            createElement('h1', {}, 'CARD COLLECTION'),
            createElement('span', { className: 'collection-count' }, `${reactiveState.player.inventory.length} / ${reactiveState.cards.length}`)
        ),
        createElement('div', { className: 'collection-grid' },
            ...reactiveState.cards.map(card => {
                const isOwned = reactiveState.player.inventory.includes(card.id);
                return renderCardThumbnail(card, isOwned, () => openCardDetail(card));
            })
        )
    );

    return screen;
}

/**
 * DECK BUILDER SCREEN
 */
export function renderDeckBuilder() {
    const screen = createElement('div', { className: 'screen-deck-builder animate-fade-in' },
        createElement('div', { className: 'header' },
            createElement('button', { className: 'btn-back', onclick: () => navigateTo('main-menu') }, '←'),
            createElement('h1', {}, 'BUILD YOUR DECK'),
            createElement('p', {}, 'Select 4 cards for battle')
        ),
        createElement('div', { className: 'deck-builder-layout' },
            // Left: Inventory
            createElement('div', { className: 'inventory-side glass-panel' },
                createElement('h3', {}, 'YOUR CARDS'),
                createElement('div', { className: 'inventory-grid' },
                    ...reactiveState.cards.filter(c => reactiveState.player.inventory.includes(c.id)).map(card => {
                        return renderCardThumbnail(card, true, () => addToDeck(card.id));
                    })
                )
            ),
            // Right: Current Deck
            createElement('div', { className: 'deck-side glass-panel' },
                createElement('h3', {}, 'CURRENT DECK'),
                createElement('div', { className: 'deck-slots' },
                    ...reactiveState.player.deck.map((cardId, index) => {
                        const card = cardId ? reactiveState.cards.find(c => c.id === cardId) : null;
                        return renderDeckSlot(card, index);
                    })
                ),
                createElement('div', { className: 'deck-stats' },
                    createElement('p', {}, `Avg Cost: ${calculateAvgCost()}`),
                    createElement('button', { className: 'btn btn-primary', onclick: () => navigateTo('main-menu') }, 'CONFIRM DECK')
                )
            )
        )
    );

    return screen;
}

/**
 * PROFILE SCREEN
 */
export function renderProfile() {
    const p = reactiveState.player;
    const screen = createElement('div', { className: 'screen-profile animate-slide-up' },
        createElement('div', { className: 'header' },
            createElement('button', { className: 'btn-back', onclick: () => navigateTo('main-menu') }, '←'),
            createElement('h1', {}, 'PLAYER PROFILE')
        ),
        createElement('div', { className: 'profile-content glass-panel' },
            createElement('div', { className: 'profile-header' },
                createElement('div', { className: 'profile-avatar' }, '👤'),
                createElement('div', { className: 'profile-meta' },
                    createElement('h2', {}, p.name),
                    createElement('p', {}, `Level ${p.level} Warrior`),
                    createElement('div', { className: 'xp-bar-container' },
                        createElement('div', { className: 'xp-bar', style: { width: `${(p.xp / p.xpToNext) * 100}%` } }),
                        createElement('span', {}, `${p.xp} / ${p.xpToNext} XP`)
                    )
                )
            ),
            createElement('div', { className: 'profile-stats-grid' },
                createStatBox('Battles', p.stats.battles),
                createStatBox('Wins', p.stats.wins),
                createStatBox('Losses', p.stats.losses),
                createStatBox('Win Rate', `${((p.stats.wins / (p.stats.battles || 1)) * 100).toFixed(1)}%`)
            )
        )
    );

    return screen;
}

/**
 * BATTLE SELECTION SCREEN
 */
export function renderBattleSelection() {
    const screen = createElement('div', { className: 'screen-battle-selection animate-fade-in' },
        createElement('div', { className: 'header' },
            createElement('button', { className: 'btn-back', onclick: () => navigateTo('main-menu') }, '←'),
            createElement('h1', {}, 'SELECT DIFFICULTY')
        ),
        createElement('div', { className: 'difficulty-grid' },
            createDifficultyBtn('EASY', 'easy'),
            createDifficultyBtn('MEDIUM', 'medium'),
            createDifficultyBtn('HARD', 'hard')
        )
    );
    return screen;
}

function createDifficultyBtn(label, value) {
    return createElement('button', { 
        className: 'btn btn-primary diff-btn',
        onclick: () => startBattle(value)
    }, label);
}

/**
 * BATTLE SCREEN (Gameplay)
 */
export function renderBattle() {
    const b = battleState;
    const screen = createElement('div', { className: 'screen-battle animate-fade-in' },
        // Top: Enemy Area
        createElement('div', { className: 'battle-area enemy-area' },
            renderBattleStats('enemy', b.enemy),
            createElement('div', { className: 'battle-field' },
                ...b.enemy.field.map((card, i) => renderFieldSlot(card, 'enemy', i))
            )
        ),

        // Middle: Turn Info
        createElement('div', { className: 'battle-divider' },
            createElement('div', { className: 'turn-indicator' }, 
                b.turn === 'player' ? 'YOUR TURN' : 'OPPONENT\'S TURN'
            ),
            createElement('button', { 
                className: 'btn btn-secondary end-turn-btn',
                onclick: endTurn
            }, 'END TURN')
        ),

        // Bottom: Player Area
        createElement('div', { className: 'battle-area player-area' },
            createElement('div', { className: 'battle-field' },
                ...b.player.field.map((card, i) => renderFieldSlot(card, 'player', i))
            ),
            renderBattleStats('player', b.player),
            createElement('div', { className: 'battle-hand' },
                ...b.player.hand.map(card => renderHandCard(card))
            )
        )
    );

    return screen;
}

function renderBattleStats(side, data) {
    const color = side === 'player' ? 'var(--accent-cyan)' : 'var(--accent-red)';
    return createElement('div', { className: 'battle-stats-bar' },
        createElement('div', { className: 'hp-bar-container' },
            createElement('div', { className: 'hp-bar-fill', style: { width: `${(data.hp / data.maxHp) * 100}%`, background: color } }),
            createElement('span', {}, `${data.hp} / ${data.maxHp}`)
        ),
        createElement('div', { className: 'mana-orbs' }, 
            '●'.repeat(data.mana) + '○'.repeat(data.maxMana - data.mana)
        )
    );
}

function renderFieldSlot(card, side, index) {
    if (!card) return createElement('div', { className: 'field-slot empty' });

    return createElement('div', { className: `field-slot filled ${side}` },
        createElement('div', { className: 'field-card-hp' }, `${card.currentHp} HP`),
        createElement('div', { className: 'field-card-name' }, card.name)
    );
}

function renderHandCard(card) {
    const canAfford = battleState.player.mana >= card.cost;
    return createElement('div', { 
        className: `hand-card ${canAfford ? '' : 'disabled'}`,
        onclick: () => deployCard(card)
    },
        createElement('div', { className: 'hand-card-cost' }, card.cost),
        createElement('div', { className: 'hand-card-name' }, card.name)
    );
}

function deployCard(card) {
    if (battleState.turn !== 'player') return;
    if (battleState.player.mana < card.cost) return;

    const emptyIndex = battleState.player.field.indexOf(null);
    if (emptyIndex > -1) {
        battleState.player.field[emptyIndex] = { ...card, currentHp: card.hp };
        battleState.player.mana -= card.cost;
        
        // In a real version, we'd remove from hand
        
        navigateTo('battle'); // Refresh
    }
}

// --- SUB-COMPONENTS ---

function renderCardThumbnail(card, isOwned, onclick) {
    const rarityClass = card.rarity.toLowerCase();
    return createElement('div', { 
        className: `card-thumbnail ${rarityClass} ${isOwned ? '' : 'not-owned'}`,
        onclick: onclick
    },
        createElement('div', { className: 'card-image-placeholder' }, 
            card.image ? createElement('img', { src: card.image }) : '?'
        ),
        createElement('div', { className: 'card-info' },
            createElement('p', { className: 'card-name' }, card.name),
            createElement('div', { className: 'card-meta' },
                createElement('span', { className: 'card-cost' }, `💧 ${card.cost}`),
                createElement('span', { className: 'card-stars' }, '⭐'.repeat(card.stars))
            )
        )
    );
}

function renderDeckSlot(card, index) {
    if (!card) {
        return createElement('div', { className: 'deck-slot empty' }, 
            createElement('span', {}, `Slot ${index + 1}`),
            createElement('p', {}, 'Empty')
        );
    }

    return createElement('div', { className: 'deck-slot filled' },
        createElement('span', { className: 'remove-btn', onclick: (e) => { e.stopPropagation(); removeFromDeck(index); } }, '×'),
        createElement('p', { className: 'card-name' }, card.name),
        createElement('p', { className: 'card-cost' }, `💧 ${card.cost}`)
    );
}

function createStatBox(label, value) {
    return createElement('div', { className: 'stat-box' },
        createElement('span', { className: 'stat-value' }, value),
        createElement('span', { className: 'stat-label' }, label)
    );
}

// --- LOGIC ---

function addToDeck(cardId) {
    const deck = reactiveState.player.deck;
    const existingIndex = deck.indexOf(cardId);
    if (existingIndex > -1) return; // Already in deck

    const emptyIndex = deck.indexOf(null);
    if (emptyIndex > -1) {
        deck[emptyIndex] = cardId;
        navigateTo('deck-builder'); // Re-render
    } else {
        alert('Deck is full! Remove a card first.');
    }
}

function removeFromDeck(index) {
    reactiveState.player.deck[index] = null;
    navigateTo('deck-builder'); // Re-render
}

function calculateAvgCost() {
    const deck = reactiveState.player.deck.filter(id => id !== null);
    if (deck.length === 0) return '0.0';
    const sum = deck.reduce((acc, id) => {
        const card = reactiveState.cards.find(c => c.id === id);
        return acc + (card ? card.cost : 0);
    }, 0);
    return (sum / deck.length).toFixed(1);
}

function openCardDetail(card) {
    alert(`Card: ${card.name}\nAnime: ${card.anime}\nHP: ${card.hp}\nDMG: ${card.dmg}\nDescription: ${card.description}`);
}

export function renderShop() { return createElement('div', {}, 'Shop Screen'); }
export function renderBattleEnd() { return createElement('div', {}, 'Battle End Screen'); }
