// App.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Actions as LayoutVarsActions } from './LayoutVars.js';
import UserNameInput from './UserNameInput.react.js';
import User from './User.react.js';
import ChatroomUsers from './ChatroomUsers.react.js';
import Messages from './Messages.react.js';
import MessageInput from './MessageInput.react.js';
import '../css/app.less';

import PeopleIcon from '../img/people_icon.png';

class App extends React.Component {
    constructor(props) { super(props); }
    render() {
        const {
            roomName, name, chatroomUsersHeight,
            shouldCollapseChatroomUsers, updateShouldCollapseChatroomUsers
        } = this.props;
        const chatroomUsersWrapperHeight = shouldCollapseChatroomUsers
            ? '0px'
            : `${chatroomUsersHeight + 5}px`;
        return <div className='app'>
            {!name && <div className='app-user-name-input-wrapper'>
                <UserNameInput />
            </div>}
            {name && <div className='info'>
                <div className='headings-wrapper'>
                    <div className='user-wrapper'>
                        <User />
                    </div>
                    <div
                        className='shoule-collapse-chatroom-users-toggler' role='button'
                        onClick={() => updateShouldCollapseChatroomUsers({
                            shouldCollapseChatroomUsers: !shouldCollapseChatroomUsers
                        })}
                    ><img src={PeopleIcon} title='users' /></div>
                </div>
                <div className='chatroom-users-wrapper' style={{height: chatroomUsersWrapperHeight}}>
                    <ChatroomUsers roomName={roomName} />
                </div>
            </div>}
            {name && <div className='chatroom'>
                <div className='messages-wrapper'>
                    <Messages roomName={roomName} />
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
            roomName: state.room.name,
            name: state.user.name,
            chatroomUsersHeight: state.layoutVars.chatroomUsersHeight,
            shouldCollapseChatroomUsers: state.layoutVars.shouldCollapseChatroomUsers,
        };
    },
    (dispatch, ownProps) => ({
        updateShouldCollapseChatroomUsers: ({ shouldCollapseChatroomUsers }) => {
            return dispatch(LayoutVarsActions.updateLayoutVars({layoutVars: { shouldCollapseChatroomUsers }}));
        },
    })
)(App);
