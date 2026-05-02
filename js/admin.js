/**
 * ANIME ROYALE - ADMIN PANEL LOGIC
 */

import { reactiveState } from './state.js';
import { getCardById, updateCard, createNewCard } from './cards.js';
import { createElement } from './ui.js';

let currentEditingId = null;

export function initAdminPanel(container) {
    renderCardList(container.querySelector('.admin-card-list'));
    
    // Add "New Card" button to sidebar
    const newBtn = createElement('button', { 
        className: 'btn btn-gold', 
        style: { width: '100%', marginTop: 'auto' },
        onclick: () => {
            const newCard = createNewCard();
            selectCard(newCard.id, container);
        }
    }, 'Create New Card');
    
    container.querySelector('.admin-sidebar').appendChild(newBtn);
}

function renderCardList(listContainer) {
    listContainer.innerHTML = '';
    
    reactiveState.cards.forEach(card => {
        const item = createElement('div', { 
            className: `admin-card-item ${currentEditingId === card.id ? 'active' : ''}`,
            onclick: () => selectCard(card.id, document.querySelector('.screen-admin'))
        }, `${card.id} - ${card.name}`);
        listContainer.appendChild(item);
    });
}

function selectCard(id, screen) {
    currentEditingId = id;
    renderCardList(screen.querySelector('.admin-card-list'));
    renderEditor(screen.querySelector('.admin-editor'), id);
}

function renderEditor(container, id) {
    const card = getCardById(id);
    if (!card) return;

    container.innerHTML = '';
    
    const form = createElement('div', { className: 'editor-form animate-fade-in' },
        createElement('h2', {}, `Editing: ${card.name}`),
        
        createField('Name', 'text', 'name', card.name),
        createField('Anime', 'text', 'anime', card.anime),
        createField('Description', 'textarea', 'description', card.description),
        
        createElement('div', { className: 'stats-grid' },
            createField('HP', 'number', 'hp', card.hp),
            createField('Damage', 'number', 'dmg', card.dmg),
            createField('Speed', 'number', 'speed', card.speed),
            createField('Defense', 'number', 'def', card.def)
        ),
        
        createField('Cost', 'number', 'cost', card.cost),
        createField('Rarity', 'select', 'rarity', card.rarity, ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic']),
        createField('Max Stars', 'number', 'maxStars', card.maxStars),
        createField('Ascends To (Card ID)', 'select', 'ascendsTo', card.ascendsTo, [null, ...reactiveState.cards.map(c => c.id)]),
        
        createElement('div', { className: 'form-actions' },
            createElement('button', { 
                className: 'btn btn-primary',
                onclick: () => saveCardChanges(id)
            }, 'Save Changes')
        )
    );

    container.appendChild(form);
}

function createField(label, type, key, value, options = []) {
    const wrapper = createElement('div', { className: 'form-field' });
    wrapper.appendChild(createElement('label', {}, label));
    
    let input;
    if (type === 'textarea') {
        input = createElement('textarea', { id: `edit-${key}` }, value);
    } else if (type === 'select') {
        input = createElement('select', { id: `edit-${key}` });
        options.forEach(opt => {
            const o = createElement('option', { value: opt }, opt);
            if (opt === value) o.selected = true;
            input.appendChild(o);
        });
    } else {
        input = createElement('input', { type, id: `edit-${key}`, value });
    }
    
    wrapper.appendChild(input);
    return wrapper;
}

function saveCardChanges(id) {
    const card = getCardById(id);
    if (!card) return;

    const updatedData = {
        ...card,
        name: document.getElementById('edit-name').value,
        anime: document.getElementById('edit-anime').value,
        description: document.getElementById('edit-description').value,
        hp: parseInt(document.getElementById('edit-hp').value),
        dmg: parseInt(document.getElementById('edit-dmg').value),
        speed: parseInt(document.getElementById('edit-speed').value),
        def: parseInt(document.getElementById('edit-def').value),
        cost: parseInt(document.getElementById('edit-cost').value),
        rarity: document.getElementById('edit-rarity').value,
        maxStars: parseInt(document.getElementById('edit-maxStars').value),
        ascendsTo: document.getElementById('edit-ascendsTo').value === 'null' ? null : document.getElementById('edit-ascendsTo').value
    };

    updateCard(updatedData);
    alert('Card Saved!');
    selectCard(id, document.querySelector('.screen-admin'));
}
