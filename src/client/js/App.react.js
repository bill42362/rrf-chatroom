// App.react.js
'use strict';
import React from 'react';
import Debug from 'debug';
import '../css/app.less';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('rrf-chatroom:*'); }

class App extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { } = this.props;
        return <div className='app'>
            React-Redux-Firebase Chatroom
        </div>;
    }
}

export default App;
