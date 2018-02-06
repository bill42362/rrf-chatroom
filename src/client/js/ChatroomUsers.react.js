// ChatroomUsers.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import '../css/chatroom-users.less';

class ChatroomUsers extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { users } = this.props;
        const onlineIndicator = <div className='chatroom-user-online'>・</div>;
        const userList = !isLoaded(users)
            ? <div className='mock-user'>Loading ...</div>
            : isEmpty(users)
                ? <div className='mock-user'>No online user for now.</div>
                : Object.keys(users).map((key, index) => {
                    const user = users[key];
                    const oddClassName = 0 === index%2 ? ' chatroom-user-odd' : '';
                    const lastOnline = <div className='chatroom-user-lastOnline'>{user.lastOnline}</div>;
                    return <div className={`chatroom-user${oddClassName}`} key={index}>
                        <div className='chatroom-user-name'>{key}</div>
                        {user.connections ? onlineIndicator : lastOnline}
                    </div>;
                });
        return <div className='chatroom-users'>
            {userList}
        </div>;
    }
}

export default compose(
    firebaseConnect(['chatroomUsers']),
    connect(
        (state, ownProps) => {
            return {
                users: state.firebase.data.chatroomUsers,
            };
        }
    )
)(ChatroomUsers);
