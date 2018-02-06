// App.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Debug from 'debug';
import User from './User.react.js';
import { Actions as UserActions } from './User.js';
import ChatroomUsers from './ChatroomUsers.react.js';
import Messages from './Messages.react.js';
import MessageInput from './MessageInput.react.js';
import '../css/app.less';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('rrf-chatroom:*'); }

class App extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    onKeyDown(e) {
        if(13 === e.keyCode && !e.shiftKey) {
            e.preventDefault();
            const { updateName, editingName } = this.props;
            updateName({name: editingName.trim()})
            return false;
        }
    }
    render() {
        const { name, editingName, updateName, updateEditingName } = this.props;
        return <div className='app'>
            {!name && <div className='app-user-name-input-wrapper'>
                <div className='app-user-name-input'>
                    <div className='app-user-name-input-description'>Please enter your nickname.</div>
                    <input
                        className='app-user-name-input' autoFocus
                        value={editingName} onChange={e => { updateEditingName({editingName: e.target.value}); }}
                        onKeyDown={this.onKeyDown}
                    />
                </div>
            </div>}
            {name && <div className='info'>
                <div className='user-wrapper'>
                    <User />
                </div>
                <div className='chatroom-users-wrapper'>
                    <ChatroomUsers />
                </div>
            </div>}
            {name && <div className='chatroom'>
                <div className='messages-wrapper'>
                    <Messages />
                </div>
                <div className='message-input-wrapper'>
                    <MessageInput />
                </div>
            </div>}
        </div>;
    }
}

export default connect(
    (state, ownProps) => {
        return {
            name: state.user.name,
            editingName: state.user.editingName,
        };
    },
    (dispatch, ownProps) => ({
        updateName: ({ name }) => {
            return dispatch(UserActions.updateName({ name }));
        },
        updateEditingName: ({ editingName }) => {
            return dispatch(UserActions.updateEditingName({ editingName }));
        },
    })
)(App);
