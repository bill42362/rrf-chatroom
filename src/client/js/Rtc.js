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
    icecandidates: [],
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

const addLocalPeerPack = ({ roomName, remoteClientId, isAnswerPeer, dispatch, firebase }) => {
    const database = firebase.database();
    const selfIceCandidatesRef = database.ref(`${roomName}/rtcClients/${clientId}/peerPacks/${remoteClientId}/iceCandidates`);
    const remoteIceCandidatesRef = database.ref(`${roomName}/rtcClients/${remoteClientId}/peerPacks/${clientId}/iceCandidates`);
    const selfDescriptionRef = database.ref(`${roomName}/rtcClients/${clientId}/peerPacks/${remoteClientId}/description`);
    const remoteDescriptionRef = database.ref(`${roomName}/rtcClients/${remoteClientId}/peerPacks/${clientId}/description`);
    const localPeerPack = new LocalPeerPack({ remoteClientId, isAnswerPeer });
    let pendingIceCandidates = [];
    localPeerPack.ondescription = description => {
        if(description) {
            const ref = selfDescriptionRef.set(JSON.stringify(description));
            ref.onDisconnect().remove();
        } else {
            console.log('localPeerPack.ondescription() empty description.');
        }
    };
    localPeerPack.peerConnection.onicecandidate = event => {
        if(event.candidate) {
            const ref = selfIceCandidatesRef.push(JSON.stringify(event.candidate));
            ref.onDisconnect().remove();
        } else {
            console.log('localPeerPack.onicecandidate() empty candidate.');
        }
    };
    localPeerPack.peerConnection.ontrack = event => {
        console.log('ontrack() event:', event);
    };
    localPeerPack.peerConnection.onconnectionstatechange = event => {
        console.log('onconnectionstatechange() connectionState:', localPeerPack.peerConnection.connectionState);
    };
    localPeerPack.peerConnection.oniceconnectionstatechange = event => {
        console.log('oniceconnectionstatechange() iceConnectionState:', localPeerPack.peerConnection.iceConnectionState);
    };
    localPeerPack.peerConnection.onicegatheringstatechange = event => {
        console.log('onicegatheringstatechange() iceGatheringState:', localPeerPack.peerConnection.iceGatheringState);
        console.log('onicegatheringstatechange() iceConnectionState:', localPeerPack.peerConnection.iceConnectionState);
    };
    remoteIceCandidatesRef.on('child_added', snapshot => {
        const addedIceCandidate = JSON.parse(snapshot.val());
        if(!localPeerPack.peerConnection.remoteDescription.type){
            pendingIceCandidates.push(addedIceCandidate);
        } else {
            localPeerPack.peerConnection.addIceCandidate(addedIceCandidate)
                .then(() => { console.log('child_added() addedIceCandidate:', addedIceCandidate); });
        }
    });
    remoteDescriptionRef.on('value', snapshot => {
        const changedDescription = JSON.parse(snapshot.val());
        if(changedDescription) {
            localPeerPack.peerConnection.setRemoteDescription(changedDescription);
            Promise.all(pendingIceCandidates.map(candidate => localPeerPack.peerConnection.addIceCandidate(candidate)))
                .then(() => { pendingIceCandidates = []; })
                .catch(error => console.log);
        }
    });
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
            roomName, dispatch, firebase
        });
    });

    resolve({ firebase, roomName, userName });
});

export const Actions = { };

export default { Reducer, Actions, createRtcData };
