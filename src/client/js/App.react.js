// App.react.js
'use strict';
import React from 'react';
import Debug from 'debug';
import User from './User.react.js';
import ChatroomUsers from './ChatroomUsers.react.js';
import Messages from './Messages.react.js';
import MessageInput from './MessageInput.react.js';
import '../css/app.less';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('rrf-chatroom:*'); }

class App extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { } = this.props;
        return <div className='app'>
            <div className='info'>
                <div className='user-wrapper'>
                    <User />
                </div>
                <div className='chatroom-users-wrapper'>
                    <ChatroomUsers />
                </div>
            </div>
            <div className='chatroom'>
                <div className='messages-wrapper'>
                    <Messages />
                </div>
                <div className='message-input-wrapper'>
                    <MessageInput />
                </div>
            </div>
        </div>;
    }
}

export default App;
