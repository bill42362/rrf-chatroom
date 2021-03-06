// User.js
'use strict';

let connectRef = undefined;
let connectionsRef = undefined;
let lastOnlineRef = undefined;

const defaultState = {
    name: '',
    editingName: '',
};

export const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_USER_NAME':
        case 'UPDATE_USER_EDITING_NAME':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}

const updateName = ({ name }) => (dispatch, getState, getFirebase) => {
    return new Promise((resolve, reject) => {
        const firebase = getFirebase();
        const database = firebase.database();
        connectRef = database.ref('/.info/connected');
        connectionsRef = database.ref(`/chatroomUsers/${name}/connections`);
        lastOnlineRef = database.ref(`/chatroomUsers/${name}/lastOnline`);
        connectRef.on('value', snapshot => {
            if(true === snapshot.val()) {
                const con = connectionsRef.push(true);
                con.onDisconnect().remove();
                lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            }
        });
        dispatch({type: 'UPDATE_USER_NAME', payload: { name }});
        resolve({ name });
    });
};

const updateEditingName = ({ editingName }) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({type: 'UPDATE_USER_EDITING_NAME', payload: { editingName }});
        resolve({ editingName });
    });
};

export const Actions = { updateName, updateEditingName };

export default { Reducer, Actions };
