// createPeerConnection.js
'use strict'
import { stunServers } from './stunServers.js';
const iceServers = stunServers.map(server => {
    return {url: `stun:${server}`};
});
const defaultPeerConnectionConfig = { iceServers };
const PeerConnection = window.RTCPeerConnection
    || window.webkitRTCPeerConnection
    || window.mozRTCPeerConnection
    || window.msRTCPeerConnection;
export const createPeerConnection = (config = defaultPeerConnectionConfig) => {
    return new PeerConnection(Object.assign({}, defaultPeerConnectionConfig, config));
}
export default { createPeerConnection };
