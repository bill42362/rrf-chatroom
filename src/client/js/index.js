// index.js
'use strict';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import * as firebase from 'firebase/app';
import { reactReduxFirebase, getFirebase, firebaseReducer } from 'react-redux-firebase';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Debug from 'debug';
import LayoutVars from './LayoutVars.js';
import User from './User.js';
import MessageInput from './MessageInput.js';
import App from './App.react.js';
import 'firebase/database';
import 'normalize.css';
import '../css/index.less';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('rrf-chatroom:*'); }

const reducer = combineReducers({
    firebase: firebaseReducer,
    layoutVars: LayoutVars.Reducer,
    user: User.Reducer,
    messageInput: MessageInput.Reducer,
});

const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG;
const fbConfig = {
    apiKey: FIREBASE_CONFIG.API_KEY,
    authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
    databaseURL: FIREBASE_CONFIG.DATABASE_URL,
    projectId: FIREBASE_CONFIG.PROJECT_ID,
    storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
    messagingSenderId: FIREBASE_CONFIG.MESSAGE_SENDER_ID,
};
firebase.initializeApp(fbConfig);

const rrfConfig = {
    userProfile: 'rrfUsers',
    enableLogging: false
};

const store = createStore(
    reducer,
    compose(
        applyMiddleware(
            ReduxThunk.withExtraArgument(getFirebase)
        )
    ),
    reactReduxFirebase(firebase, rrfConfig)
);

ReactDOM.render(
    <Provider store={store} >
        <App />
    </Provider>,
    document.getElementById('app-root')
);
