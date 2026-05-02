/**
 * ANIME ROYALE - CARD DATA MANAGEMENT
 */

import { reactiveState } from './state.js';

/**
 * Initial empty card pool (Placeholder)
 * In a real scenario, this would be fetched from GitHub JSON.
 */
const DEFAULT_CARDS = [
    {
        id: 'char_001',
        name: 'Tanjiro',
        anime: 'Demon Slayer',
        hp: 450,
        dmg: 85,
        speed: 70,
        def: 60,
        cost: 5,
        rarity: 'Epic',
        tier: 'B',
        stars: 3,
        maxStars: 5,
        type: ['Water', 'Sword'],
        skills: ['Water Breathing 1st Form'],
        description: 'A kind-hearted boy who seeks a cure for his sister.',
        image: null
    },
    {
        id: 'char_002',
        name: 'Goku',
        anime: 'Dragon Ball',
        hp: 600,
        dmg: 120,
        speed: 90,
        def: 80,
        cost: 8,
        rarity: 'Legendary',
        tier: 'S',
        stars: 4,
        maxStars: 5,
        type: ['Holy', 'Hand-to-Hand'],
        skills: ['Kamehameha'],
        description: 'A Saiyan warrior who constantly pushes his limits.',
        image: null
    }
];

export function initCards() {
    // Check if cards already exist in state, if not, load defaults
    if (reactiveState.cards.length === 0) {
        reactiveState.cards = [...DEFAULT_CARDS];
    }
}

export function getCardById(id) {
    return reactiveState.cards.find(c => c.id === id);
}

export function updateCard(cardData) {
    const index = reactiveState.cards.findIndex(c => c.id === cardData.id);
    if (index > -1) {
        reactiveState.cards[index] = { ...cardData };
        return true;
    }
    return false;
}

export function createNewCard() {
    const newId = 'char_' + Date.now();
    const newCard = {
        id: newId,
        name: 'New Character',
        anime: 'Unknown',
        hp: 100,
        dmg: 10,
        speed: 10,
        def: 10,
        cost: 1,
        rarity: 'Common',
        tier: 'E',
        stars: 1,
        maxStars: 5,
        type: [],
        skills: [],
        description: '',
        image: null,
        ascendsTo: null // ID of the character this card evolves into
    };
    reactiveState.cards.push(newCard);
    return newCard;
}
