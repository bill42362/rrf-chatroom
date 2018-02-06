// User.js

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

const updateName = ({ name }) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
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
