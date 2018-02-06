// ChatroomUsers.js

const defaultState = [
    {name: 'Sbii'},
    {name: 'Sbiii'},
    {name: 'Sbiiii'},
];

export const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_CHATROOM_USERS':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}

const updateChatroomUsers = ({ users }) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({type: 'UPDATE_CHATROOM_USERS', payload: { users }});
        resolve({ users });
    });
};

export const Actions = { updateChatroomUsers };

export default { Reducer, Actions };
