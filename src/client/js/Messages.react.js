// Messages.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import '../css/messages.less';

class Messages extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { messages } = this.props;
        const messageList = !isLoaded(messages)
            ? 'Loading'
            : isEmpty(messages)
                ? 'No messages for now.'
                : Object.keys(messages).map((key, index) => {
                    return <div key={key}>{JSON.stringify(messages[key])}</div>
                });
        return <div className='messages'>
            {messageList}
        </div>;
    }
}

export default compose(
    firebaseConnect(['messages']),
    connect(
        (state, ownProps) => ({
            messages: state.firebase.data.messages,
        })
    )
)(Messages);
