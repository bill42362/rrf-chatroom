// ChatroomUsers.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import '../css/chatroom-users.less';

class ChatroomUsers extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { users } = this.props;
        return <div className='chatroom-users'>
            {users.map((user, index) => {
                const oddClassName = 0 === index%2 ? ' chatroom-user-odd' : '';
                return <div className={`chatroom-user${oddClassName}`} key={index}>
                    <div className='chatroom-user-name'>{user.name}</div>
                </div>;
            })}
        </div>;
    }
}

export default connect(
    (state, ownProps) => ({
        users: state.chatroomUsers,
    })
)(ChatroomUsers);
