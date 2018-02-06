// MessageInput.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Contenteditable from 'react-contenteditable';
import { Actions } from './MessageInput.js';
import { sendMessage } from './Messages.js';
import '../css/message-input.less';

class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    onKeyDown(e) {
        if(13 === e.keyCode && !e.shiftKey) {
            e.preventDefault();
            const { message: m, updateMessage, sendMessage } = this.props;
            const message = Object.assign({}, m);
            this.input.lastHtml = '';
            updateMessage({message: {content: ''}})
            sendMessage({ message });
            return false;
        }
    }
    render() {
        const { userName, message, updateMessage } = this.props;
        const contenteditable = <Contenteditable
            tagName='p' className='message-input-contenteditable'
            html={message.content} tabIndex='0' ref={input => { this.input = input; }}
            onChange={e => { updateMessage({message: {content: e.target.value}}); }}
            onKeyDown={this.onKeyDown}
        />;
        const setupUserNameMessage = <div className='setup-user-name-message'>
            Please setup your name first.
        </div>;
        return <div className='message-input'>
            {userName ? contenteditable : setupUserNameMessage}
        </div>;
    }
}

export default connect(
    (state, ownProps) => ({
        message: state.messageInput,
        userName: state.user.name,
    }),
    (dispatch, ownProps) => ({
        updateMessage: ({ message }) => {
            return dispatch(Actions.updateMessage({ message }));
        },
        sendMessage: ({ message }) => {
            return dispatch(sendMessage({ message }));
        },
    })
)(MessageInput);
