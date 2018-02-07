// Message.react.js
'use strict';
import React from 'react';
import { getDateStringWithFormat } from './Utils.js';
import '../css/message.less';

class Message extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { message } = this.props;
        return <div className='message'>
            <div className='message-metadata'>
                <div className='message-author'>{message.author}</div>
                <div className='message-time'>
                    {getDateStringWithFormat({timestamp: message.timestamp, format: 'YYYY/MM/DD hh:mm'})}
                </div>
            </div>
            <div className='message-content'>{message.content}</div>
        </div>;
    }
}

export default Message;
