// Messages.js
import Debug from 'debug';

const defaultMessage = {
    author: '',
    content: '',
    timestamp: undefined,
};

export const sendMessage = ({ message }) => (dispatch, getState, getFirebase) => {
    const firebase = getFirebase();
    firebase
    .push(
        'messages',
        Object.assign({}, defaultMessage, {timestamp: Date.now()}, message)
    )
    .catch(error => {
        Debug('rrf-chatroom:Messages')('sendMessage() error:', error);
    });
};

export default { sendMessage };
