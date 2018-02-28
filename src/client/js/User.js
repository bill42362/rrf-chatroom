// User.js
'use strict';
import { createRtcData } from './Rtc.js';

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
        const { name: roomName } = getState().room;
        const firebase = getFirebase();
        const database = firebase.database();
        connectRef = database.ref('/.info/connected');
        connectionsRef = database.ref(`${roomName}/users/${name}/connections`);
        lastOnlineRef = database.ref(`${roomName}/users/${name}/lastOnline`);
        connectRef.on('value', snapshot => {
            if(true === snapshot.val()) {
                const con = connectionsRef.push(true);
                con.onDisconnect().remove();
                lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
                createRtcData({userName: name, dispatch, getState, firebase, roomName });
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
