/**
 * ANIME ROYALE - GLOBAL STATE MANAGEMENT
 */

export const CARD_TYPES = ['Fire', 'Water', 'Nature', 'Lightning', 'Dark', 'Holy', 'Sword', 'Magic', 'Hand-to-Hand', 'Projectile', 'Summon'];
export const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

export const state = {
    player: {
        name: "Player_12345",
        level: 5,
        xp: 2450,
        xpToNext: 5000,
        gold: 12500,
        gems: 350,
        energy: 10,
        inventory: ['char_001', 'char_002'],
        deck: [null, null, null, null],
        stats: {
            battles: 156,
            wins: 98,
            losses: 58,
            streak: 7,
            bestStreak: 15
        }
    },
    cards: [], // Global card database
    skills: [], // Global skill database
    currentScreen: 'main-menu',
    isAdmin: false,
    settings: {
        volume: 80,
        music: true,
        sfx: true,
        difficulty: 'medium'
    }
};

// Create a reactive state proxy
const listeners = [];

export const subscribe = (callback) => {
    listeners.push(callback);
    return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
    };
};

const handler = {
    set(target, property, value) {
        target[property] = value;
        listeners.forEach(callback => callback(target));
        return true;
    },
    get(target, property) {
        if (typeof target[property] === 'object' && target[property] !== null) {
            return new Proxy(target[property], handler);
        }
        return target[property];
    }
};

export const reactiveState = new Proxy(state, handler);
