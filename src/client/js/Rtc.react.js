// Rtc.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Peer from './Peer.react.js';
import '../css/rtc.less';

class Rtc extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { peerPacks } = this.props;
        return <div className='rtc'>
            {peerPacks.map((peerPack, index) => {
                return <Peer {...peerPack} />;
            })}
        </div>;
    }
}

export default connect(
    (state, ownProps) => {
        const { peerPacks } = state.rtc;
        return {
            peerPacks
        };
    },
    (dispatch, ownProps) => ({
    })
)(Rtc);
