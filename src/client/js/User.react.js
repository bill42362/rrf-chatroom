// User.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import '../css/user.less';

class User extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { name } = this.props;
        return <div className='user'>
            <div className='user-name'>
                <span className='user-name-text'>{name}</span>
                <span className='user-name-label'>(you)</span>
            </div>
        </div>;
    }
}

export default connect(
    (state, ownProps) => ({
        name: state.user.name,
    })
)(User);
