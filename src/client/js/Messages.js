// Messages.js
import Debug from 'debug';

const defaultMessage = {
    author: '',
    content: '',
    timestamp: undefined,
};

export const sendMessage = ({ message }) => (dispatch, getState, getFirebase) => {
    const firebase = getFirebase();
    const { name: author } = getState().user;
    const timestamp = Date.now();
    return firebase
    .push(
        'messages',
        Object.assign(
            {},
            defaultMessage,
            { author, timestamp},
            message
        )
    )
    .catch(error => {
        Debug('rrf-chatroom:Messages')('sendMessage() error:', error);
    });
};

export default { sendMessage };
