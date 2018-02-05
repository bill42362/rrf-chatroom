// Messaging.js
import 'isomorphic-fetch';
import Debug from 'debug';

let messaging = undefined;
let instanceIdToken = undefined;

export const initMessaging = ({ messaging: m }) => {
    messaging = m;
    messaging.requestPermission()
    .then(() => messaging.getToken())
    .then(token => {
        if(token) {
            console.log('getToken() token:', token);
        } else {
            console.log('getToken() no token :(');
        }
    })
    .catch(error => {
        Debug('rrf-chatroom:Messaging')('initMessaging() error:', error);
    });
};

export default { initMessaging };
