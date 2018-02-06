// User.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Actions } from './User.js';
import '../css/user.less';

class User extends React.Component {
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
        const userNameDisplay = <div className='user-name'>
            <span className='user-name-text'>{name}</span>
            <span className='user-name-label'>(you)</span>
        </div>;
        const userNameInput = <div className='user-name-input'>
            <input
                className='user-name-input'
                placeholder='nickname' autoFocus
                value={editingName} onChange={e => { updateEditingName({editingName: e.target.value}); }}
                onKeyDown={this.onKeyDown}
            />
        </div>;
        return <div className='user'>
            {'' === name ? userNameInput : userNameDisplay}
        </div>;
    }
}

export default connect(
    (state, ownProps) => ({
        name: state.user.name,
        editingName: state.user.editingName,
    }),
    (dispatch, ownProps) => ({
        updateName: ({ name }) => {
            return dispatch(Actions.updateName({ name }));
        },
        updateEditingName: ({ editingName }) => {
            return dispatch(Actions.updateEditingName({ editingName }));
        },
    })
)(User);
