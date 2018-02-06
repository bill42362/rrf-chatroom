// MessageInput.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Actions } from './MessageInput.js';
import '../css/message-input.less';

class MessageInput extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { message, updateMessage } = this.props;
        return <div className='message-input'>
            <input
                value={message.content}
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
