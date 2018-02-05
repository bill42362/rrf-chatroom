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
            instanceIdToken = token;
        } else {
        }
    })
    .catch(error => {
        Debug('rrf-chatroom:Messaging')('initMessaging() error:', error);
    });
};

export default { initMessaging };
