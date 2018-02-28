// Rtc.js
'use strict';
import { createPeerConnection } from './createPeerConnection.js';
import { newUuid } from './Utils.js';

const clientId = newUuid();
const localPeerPacks = {};
let selfRtcClientRef = undefined;
let recevingClientIdsRef = undefined;
let rtcClientsRef = undefined;
let peerPacksRef = undefined;

const defaultState = {
    peerPacks: [],
    clientId,
};

const rtcDataTemplate = {
    userName: '', clientId: '',
    offeringUsers: [], recevingUsers: [],
    offeredClientIds: [], recevingClientIds: [],
    offeredUsers: [],
    peerPacks: [],
};

const localPeerPackTemplate = {
    remoteClientId: '',
    peerConnection: undefined,
    isAnswerPeer: false,
};

const storePeerPackTemplate = {
    remoteClientId: '',
    remoteUserName: '',
    stream: undefined,
    isSendingVideo: true, isSendingAudio: true,
    isRecevingVideo: true, isRecevingAudio: true,
};

const firebasePeerPackTemplate = {
    remoteClientId: '',
    isAnswerPeer: false,
    icecandidate: undefined,
    peerDescription: undefined,
};

export const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_USER_EDITING_NAME':
            return state;
        default:
            return state;
    }
}

class LocalPeerPack {
    constructor({ remoteClientId, isAnswerPeer, peerConnectionConfig }) {
        this.remoteClientId = remoteClientId;
        this.isAnswerPeer = isAnswerPeer;
        this.peerConnection = createPeerConnection(peerConnectionConfig);
    }
    setSendingMedia({ audio, video }) {
        if(this.peerConnection) {
            return navigator.mediaDevices.getUserMedia({ audio, video })
                .then(stream => {
                    this.peerConnection.addStream(stream);
                    if(this.isAnswerPeer) {
                        return this.peerConnection.createAnswer();
                    } else {
                        return this.peerConnection.createOffer();
                    }
                })
                .then(createdDescription => {
                    return this.peerConnection.setLocalDescription(createdDescription)
                        .then(() => createdDescription);
                })
                .then(createdDescription => {
                    if(this.ondescription) { this.ondescription(createdDescription); };
                })
                .catch(error => console.log);
        } else {
            throw new Error('LocalPeerPack.setSendingMedia() peerConnection not existed.');
        }
    }
};

class StorePeerPack {
    constructor({ firebase, remoteClientId }) {
        const database = firebase.database();
        this.remoteClientId = remoteClientId;
        this.remoteClientRef = database.ref(`${roomName}/rtcClients/${clientId}`);
        this.remoteClientRef.once('value')
            .then(snapshot => {
                const remoteRtcData = snapshot.val();
                this.remoteUserName = removedRtcData.userName;
            })
            .catch(error => console.log);
    }
};

const getRtcData = ({ userName, clientId }) => {
    return Object.assign({}, rtcDataTemplate, {
        userName, clientId
    });
};

const addPeerPacksToFirebase = ({ firebase, roomName, remoteClientId }) => {
    const database = firebase.database();
    const selfPeerPackRef = database.ref(`${roomName}/rtcClients/${clientId}/peerPacks/${remoteClientId}`);
    const remotePeerPackRef = database.ref(`${roomName}/rtcClients/${remoteClientId}/peerPacks/${clientId}`);
    selfPeerPackRef.set({isAnswerPeer: true, remoteClientId });
    remotePeerPackRef.set({remoteClientId: clientId, isAnswerPeer: false});
    selfPeerPackRef.onDisconnect().remove();
    remotePeerPackRef.onDisconnect().remove();
};

const addLocalPeerPack = ({ remoteClientId, isAnswerPeer, dispatch, firebase }) => {
    const localPeerPack = new LocalPeerPack({ remoteClientId, isAnswerPeer });
    localPeerPack.ondescription = description => {
        console.log('ondescription() description:', description);
    };
    localPeerPack.peerConnection.onicecandidate = event => {
        console.log('onicecandidate() candidate:', event.candidate);
    };
    localPeerPack.setSendingMedia({audio: true, video: true});
    localPeerPacks[remoteClientId] = localPeerPack;
};

export const createRtcData = ({ dispatch, getState, firebase, roomName, userName }) => new Promise((resolve, reject) => {
    const database = firebase.database();
    rtcClientsRef = database.ref(`${roomName}/rtcClients`);
    selfRtcClientRef = database.ref(`${roomName}/rtcClients/${clientId}`);
    selfRtcClientRef.set(getRtcData({ userName, clientId }));
    selfRtcClientRef.onDisconnect().remove();
    recevingClientIdsRef = database.ref(`${roomName}/rtcClients/${clientId}/recevingClientIds`);
    peerPacksRef = database.ref(`${roomName}/rtcClients/${clientId}/peerPacks`);

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
        const isAnswerPeer = clientId < addedRecevingClientId;
        if(isAnswerPeer) {
            addPeerPacksToFirebase({remoteClientId: addedRecevingClientId, roomName, firebase });
        }
    });

    peerPacksRef.on('child_added', snapshot => {
        const addedPeerPack = snapshot.val();
        console.log('peerPacksRef.child_added() addedPeerPack:', addedPeerPack);
        addLocalPeerPack({
            remoteClientId: addedPeerPack.remoteClientId,
            isAnswerPeer: addedPeerPack.isAnswerPeer,
            dispatch, firebase
        });
    });

    resolve({ firebase, roomName, userName });
});

export const Actions = { };

export default { Reducer, Actions, createRtcData };
