// UserNameInput.react.js
'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Actions } from './User.js';
import '../css/user-name-input.less';

class UserNameInput extends React.Component {
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
        return <div className='user-name-input'>
            <div className='user-name-input-description'>Please enter your nickname.</div>
            <input
                className='user-name-input' autoFocus
                value={editingName} onChange={e => { updateEditingName({editingName: e.target.value}); }}
                onKeyDown={this.onKeyDown}
            />
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
            return dispatch(Actions.updateName({ name }));
        },
        updateEditingName: ({ editingName }) => {
            return dispatch(Actions.updateEditingName({ editingName }));
        },
    })
)(UserNameInput);
