// Room.js
'use strict';

const roomName = location.pathname.slice(1);
if(!roomName) {
    window.history.replaceState('', '', 'lobby');
}

const defaultState = {
    name: roomName || 'lobby',
};

export const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        default:
            return state;
    }
}

export const Actions = { };

export default { Reducer, Actions };
