// LayoutVars.js
'use strict';

const defaultState = {
    chatroomUsersHeight: 0,
    shouldCollapseChatroomUsers: true,
};

export const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_LAYOUT_VARS':
            return Object.assign({}, state, action.payload.layoutVars);
        default:
            return state;
    }
}

const updateLayoutVars = ({ layoutVars }) => (dispatch, getState, getFirebase) => {
    return new Promise((resolve, reject) => {
        dispatch({type: 'UPDATE_LAYOUT_VARS', payload: { layoutVars }});
        resolve({ layoutVars });
    });
};

export const Actions = { updateLayoutVars };

export default { Reducer, Actions };
