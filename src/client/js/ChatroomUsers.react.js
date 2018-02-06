// ChatroomUsers.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { getDateStringWithFormat } from './Utils.js';
import '../css/chatroom-users.less';

const MSEC_IN_ONE_DAY = 3600*24*1000;

const onlineIndicator = <div className='chatroom-user-online'>・</div>;
class ChatroomUsers extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { users, userName } = this.props;
        const now = Date.now();
        const userList = !isLoaded(users)
            ? <div className='mock-user'>Loading ...</div>
            : isEmpty(users)
                ? <div className='mock-user'>No online user for now.</div>
                : Object.keys(users).filter(user => userName !== user).map((key, index) => {
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
                userName: state.user.name,
            };
        }
    )
)(ChatroomUsers);
