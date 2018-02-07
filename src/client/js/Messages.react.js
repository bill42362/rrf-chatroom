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
    componentDidUpdate(prevProps, prevState) {
        const { messages } = this.props;
        const { messages: prevMessages } = prevProps;
        const base = this.base;
        const heightMoreThanClient = base.scrollHeight - base.clientHeight;
        const distanceToBottom = heightMoreThanClient - base.scrollTop;
        const isFirstLoad = true === isLoaded(messages) && false === isLoaded(prevMessages);
        if(isFirstLoad || 70 > distanceToBottom) { base.scrollTop = heightMoreThanClient; }
    }
    render() {
        const { messages } = this.props;
        const messageList = !isLoaded(messages)
            ? <div className='mock-message'>Loading ...</div>
            : isEmpty(messages)
                ? <div className='mock-message'>No messages for now.</div>
                : Object.keys(messages).map((key, index) => {
                    return <Message key={key} message={messages[key]} />;
                });
        return <div className='messages' ref={base => { this.base = base; }}>
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
