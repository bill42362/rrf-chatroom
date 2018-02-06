// Messages.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import Message from './Message.react.js';
import '../css/messages.less';

class Messages extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { messages } = this.props;
        const messageList = !isLoaded(messages)
            ? <div className='mock-message'>Loading</div>
            : isEmpty(messages)
                ? <div className='mock-message'>No messages for now.</div>
                : Object.keys(messages).map((key, index) => {
                    return <Message key={key} message={messages[key]} />;
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
