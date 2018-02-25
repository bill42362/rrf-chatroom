// Rtc.js
'use strict';

let selfRtcClientRef = undefined;
let rtcClientsRef = undefined;

const rtcDataTemplate = {
    userName: '',
    clientId: '',
    offeringUsers: [],
    recevingUsers: [],

    offeredClientIds: [],
    recevingClientIds: [],

    offeredUsers: [],
};

const getRtcData = ({ firebase, roomName, userName, clientId }) => {
    return Object.assign({}, rtcDataTemplate, {
        userName, clientId
    });
};

export const createRtcData = ({ firebase, roomName, userName, clientId }) => new Promise((resolve, reject) => {
    const database = firebase.database();
    rtcClientsRef = database.ref(`${roomName}/rtcClients`);
    selfRtcClientRef = database.ref(`${roomName}/rtcClients/${clientId}`);
    selfRtcClientRef.set(getRtcData({ firebase, roomName, userName, clientId }));

    selfRtcClientRef.onDisconnect().remove();

    rtcClientsRef.on('child_removed', snapshot => {
        const removedRtcData = snapshot.val();
        selfRtcClientRef.once('value')
            .then(snapshot => {
                const selfRtcData = snapshot.val();
                if(!selfRtcData.offeredClientIds) { return; }
                const removedClientIdKeys = Object.keys(selfRtcData.offeredClientIds)
                    .filter(key => removedRtcData.clientId === selfRtcData.offeredClientIds[key]);
                return Promise.all(removedClientIdKeys.map(key => {
                    return selfRtcClientRef.child(`offeredClientIds/${key}`).remove();
                }));
            })
            .catch(error => console.log);
    });
    rtcClientsRef.on('child_added', snapshot => {
        const addedRtcData = snapshot.val();
        if(clientId === addedRtcData.clientId) { return; }
        database.ref(`${roomName}/rtcClients/${addedRtcData.clientId}/offeredClientIds`).push(clientId);
    });
    return { firebase, roomName, userName };
});

export default { createRtcData };
