// User.js

const defaultState = {
    name: 'Sbi',
};

export const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_USER_NAME':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}

const updateName = ({ name }) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({type: 'UPDATE_USER_NAME', payload: { name }});
        resolve({ name });
    });
};

export const Actions = { updateName };

export default { Reducer, Actions };
