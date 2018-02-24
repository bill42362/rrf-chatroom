// ChatroomUsers.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { getDateStringWithFormat } from './Utils.js';
import { Actions as LayoutVarsActions } from './LayoutVars.js';
import '../css/chatroom-users.less';

const MSEC_IN_ONE_DAY = 3600*24*1000;

const onlineIndicator = <div className='chatroom-user-online'>・</div>;
class ChatroomUsers extends React.Component {
    constructor(props) { super(props); }
    componentDidUpdate(prevProps, prevState) {
        const { chatroomUsersHeight, updateLayoutVarsChatroomUsersHeight } = this.props;
        const newChatroomUsersHeight = this.base.getBoundingClientRect().height;
        if(1 < Math.abs(chatroomUsersHeight - newChatroomUsersHeight)) {
            updateLayoutVarsChatroomUsersHeight({chatroomUsersHeight: newChatroomUsersHeight});
        }
    }
    render() {
        const { users, userName } = this.props;
        const now = Date.now();
        const otherUsers = users ? Object.keys(users).filter(user => userName !== user) : undefined;
        const userList = !isLoaded(otherUsers)
            ? <div className='mock-user'>Loading ...</div>
            : isEmpty(otherUsers)
                ? <div className='mock-user'>No other users for now.</div>
                : otherUsers.map((key, index) => {
                    const user = users[key];
                    const oddClassName = 0 === index%2 ? ' chatroom-user-odd' : '';
                    const shouldDisplayDate = MSEC_IN_ONE_DAY < now - user.lastOnline;
                    const lastOnline = <div className='chatroom-user-lastOnline'>
                        {shouldDisplayDate && `${getDateStringWithFormat({timestamp: user.lastOnline, format: 'MM/DD'})} `}
                        {getDateStringWithFormat({timestamp: user.lastOnline, format: 'hh:mm'})}
                    </div>;
                    return <div className={`chatroom-user${oddClassName}`} key={index}>
                        <div className='chatroom-user-name'>{key}</div>
                        {user.connections ? onlineIndicator : lastOnline}
                    </div>;
                });
        return <div className='chatroom-users' ref={base => { this.base = base; }}>
            {userList}
        </div>;
    }
}

export default compose(
    firebaseConnect(({ roomName }) => {
        return [`${roomName}/users`];
    }),
    connect(
        ({ firebase: { data }, user, layoutVars }, { roomName }) => {
            return {
                users: data[roomName] ? data[roomName].users : undefined,
                userName: user.name,
                chatroomUsersHeight: layoutVars.chatroomUsersHeight,
            };
        },
        (dispatch, ownProps) => ({
            updateLayoutVarsChatroomUsersHeight: ({ chatroomUsersHeight }) => {
                return dispatch(LayoutVarsActions.updateLayoutVars({layoutVars: { chatroomUsersHeight }}));
            },
        })
    )
)(ChatroomUsers);
