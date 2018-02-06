// MessageInput.js

const defaultState = {
    content: 'Goodday',
};

export const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_MESSAGE_INPUT':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}

const updateMessage = ({ message }) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({type: 'UPDATE_MESSAGE_INPUT', payload: message});
        resolve({ message });
    });
};

export const Actions = { updateMessage };

export default { Reducer, Actions };
