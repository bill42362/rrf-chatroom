// Peer.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import '../css/peer.less';

class Peer extends React.Component {
    constructor(props) { super(props); }
    render() {
        const {
            remoteUserName, connectionState,
            videoTrack, audioTrack,
            isSendingVideo, isSendingAudio,
            isRecevingVideo, isRecevingAudio
        } = this.props;
        return <div className='peer'>
            <div className='peer-remote-user-name'>{remoteUserName}</div>
            <div className='peer-connection-state'>{connectionState}</div>
            <div className='peer-video'></div>
            <div className='peer-audio'></div>
        </div>;
    }
}

export default Peer;
