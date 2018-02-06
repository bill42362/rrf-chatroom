// MessageInput.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Contenteditable from 'react-contenteditable';
import { Actions } from './MessageInput.js';
import '../css/message-input.less';

class MessageInput extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { message, updateMessage } = this.props;
        return <div className='message-input'>
            <Contenteditable
                tagName='p'
                className='message-input-contenteditable'
                html={message.content}
                onChange={e => {
                    updateMessage({message: {content: e.target.value}});
                }}
            />
        </div>;
    }
}

export default connect(
    (state, ownProps) => ({
        message: state.messageInput,
    }),
    (dispatch, ownProps) => ({
        updateMessage: ({ message }) => {
            return dispatch(Actions.updateMessage({ message }));
        },
    })
)(MessageInput);
