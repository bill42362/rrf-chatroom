// Message.react.js
'use strict';
import React from 'react';
import '../css/message.less';

class Message extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { message } = this.props;
        return <div className='message'>
            <div className='message-metadata'>
                <div className='message-author'>{message.author}</div>
                <div className='message-time'>{message.timestamp}</div>
            </div>
            <div className='message-content'>{message.content}</div>
        </div>;
    }
}

export default Message;
