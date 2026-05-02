/**
 * ANIME ROYALE - BATTLE ENGINE
 */

import { reactiveState } from './state.js';
import { navigateTo } from './router.js';

export const battleState = {
    isActive: false,
    turn: 'player', // 'player' or 'enemy'
    turnCount: 1,
    player: {
        hp: 1000,
        maxHp: 1000,
        mana: 1,
        maxMana: 10,
        field: [null, null], // Cards currently on field
        hand: [] // 4 Cards in hand
    },
    enemy: {
        hp: 1000,
        maxHp: 1000,
        mana: 1,
        maxMana: 10,
        field: [null, null],
        difficulty: 'medium'
    },
    history: []
};

/**
 * Start a new battle
 */
export function startBattle(difficulty = 'medium') {
    battleState.isActive = true;
    battleState.turn = 'player';
    battleState.turnCount = 1;
    battleState.enemy.difficulty = difficulty;
    
    // Reset HP/Mana
    battleState.player.hp = 1000;
    battleState.player.mana = 1;
    battleState.enemy.hp = 1000;
    battleState.enemy.mana = 1;
    
    // Clear fields
    battleState.player.field = [null, null];
    battleState.enemy.field = [null, null];
    
    // Load player hand from deck
    battleState.player.hand = reactiveState.player.deck
        .filter(id => id !== null)
        .map(id => ({ ...reactiveState.cards.find(c => c.id === id), currentHp: 0 }));
        
    // Generate enemy deck based on difficulty (simplified for now)
    // In a real version, we'd pick cards from the pool
    battleState.enemy.hand = reactiveState.cards
        .slice(0, 4)
        .map(c => ({ ...c, currentHp: 0 }));

    navigateTo('battle');
}

/**
 * End Player Turn
 */
export function endTurn() {
    if (battleState.turn === 'player') {
        battleState.turn = 'enemy';
        processTurnEffects('enemy');
        setTimeout(executeEnemyAI, 1000);
    } else {
        battleState.turn = 'player';
        battleState.turnCount++;
        processTurnEffects('player');
    }
}

function processTurnEffects(side) {
    // Regenerate Mana
    const entity = battleState[side];
    if (entity.mana < entity.maxMana) {
        entity.mana++;
    }
    
    // Field combat
    executeFieldCombat(side);
}

function executeFieldCombat(side) {
    const attackerSide = battleState[side];
    const defenderSide = battleState[side === 'player' ? 'enemy' : 'player'];

    attackerSide.field.forEach((card, index) => {
        if (card && card.currentHp > 0) {
            // Attack!
            const target = defenderSide.field[index] || null;
            if (target && target.currentHp > 0) {
                // Attack card
                target.currentHp -= Math.max(1, card.dmg - target.def);
                if (target.currentHp <= 0) {
                    defenderSide.field[index] = null;
                }
            } else {
                // Attack player/enemy directly
                defenderSide.hp -= card.dmg;
            }
        }
    });

    checkVictory();
}

function executeEnemyAI() {
    const ai = battleState.enemy;
    
    // Basic AI: Play the first affordable card into an empty slot
    for (let i = 0; i < ai.hand.length; i++) {
        const card = ai.hand[i];
        if (ai.mana >= card.cost) {
            const emptySlot = ai.field.indexOf(null);
            if (emptySlot > -1) {
                ai.field[emptySlot] = { ...card, currentHp: card.hp };
                ai.mana -= card.cost;
                break; 
            }
        }
    }

    setTimeout(endTurn, 1000);
}

function checkVictory() {
    if (battleState.enemy.hp <= 0) {
        alert('VICTORY!');
        navigateTo('main-menu');
    } else if (battleState.player.hp <= 0) {
        alert('DEFEAT!');
        navigateTo('main-menu');
    }
}
