// Peer.react.js
'use strict';
import React from 'react';
import '../css/peer.less';

class Peer extends React.Component {
    constructor(props) { super(props); }
    componentDidUpdate(prevProps, prevState) {
        const { videoTrack: prevVideoTrack } = prevProps;
        const { videoTrack, stream } = this.props;
        if(prevVideoTrack !== videoTrack) {
            console.log('componentDidUpdate() videoTrack:', videoTrack, ', stream:', stream);
            console.log(this.videoElement);
            const baseElement = this.videoElement;
            const video = document.createElement('video');
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.autoplay = true;
            video.play();
            baseElement.appendChild(video);
            console.log(video);
        }
    }
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
            <div className='peer-video' ref={video => { this.videoElement = video; }}/>
        </div>;
    }
}

export default Peer;
