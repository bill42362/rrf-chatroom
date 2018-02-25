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

const peerPackTemplate = {
    remoteClientId: '',
    peerConnection: undefined,
    isAnswerPeer: false,
    icecandidate: undefined,
    peerDescription: undefined,
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
                if(!selfRtcData.recevingClientIds) { return; }
                const removedClientIdKeys = Object.keys(selfRtcData.recevingClientIds)
                    .filter(key => removedRtcData.clientId === selfRtcData.recevingClientIds[key]);
                return Promise.all(removedClientIdKeys.map(key => {
                    return selfRtcClientRef.child(`recevingClientIds/${key}`).remove();
                }));
            })
            .catch(error => console.log);
    });
    rtcClientsRef.on('child_added', snapshot => {
        const addedRtcData = snapshot.val();
        if(clientId === addedRtcData.clientId) { return; }
        database.ref(`${roomName}/rtcClients/${addedRtcData.clientId}/recevingClientIds`).push(clientId);
    });
    return { firebase, roomName, userName };
});

export default { createRtcData };
