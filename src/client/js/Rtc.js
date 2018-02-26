// Rtc.js
'use strict';
import { createPeerConnection } from './createPeerConnection.js';

const localPeerPacks = {};
let selfRtcClientRef = undefined;
let recevingClientIdsRef = undefined;
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

class LocalPeerPack {
    constructor({ remoteClientId, isAnswerPeer, peerConnectionConfig }) {
        this.remoteClientId = remoteClientId;
        this.isAnswerPeer = isAnswerPeer;
        this.peerConnection = createPeerConnection(peerConnectionConfig);
        if(this.peerConnection) {
            this.peerConnection.onicecandidate = event => {
                if(event.candidate && this.onicecandidate) {
                    this.onicecandidate(event.candidate);
                }
            };
            navigator.mediaDevices.getUserMedia({audio: true, video: true})
                .then(stream => {
                    this.peerConnection.addStream(stream);
                    if(isAnswerPeer) {
                        return this.peerConnection.createAnswer();
                    } else {
                        return this.peerConnection.createOffer();
                    }
                })
                .then(createdDescription => {
                    this.description = createdDescription;
                    return this.peerConnection.setLocalDescription(createdDescription);
                })
                .then(() => {
                    if(this.ondescription) { this.ondescription(this.description); };
                })
                .catch(error => console.log);
        }
    }
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
    recevingClientIdsRef = database.ref(`${roomName}/rtcClients/${clientId}/recevingClientIds`);

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

    recevingClientIdsRef.on('child_added', snapshot => {
        const addedRecevingClientId = snapshot.val();
        const localPeerPack = new LocalPeerPack({
            remoteClientId: addedRecevingClientId,
            isAnswerPeer: false,
        });
        localPeerPack.ondescription = description => {
            console.log('ondescription() description:', description);
        };
        localPeerPack.onicecandidate = candidate => {
            console.log('onicecandidate() candidate:', candidate);
        };
        localPeerPacks[addedRecevingClientId] = localPeerPack;
    });

    resolve({ firebase, roomName, userName, clientId });
});

export default { createRtcData };
