# rrf-chatroom
Chatroom implementd with React-Redux-Firebase.

### Setup Config ###
* Copy `default.config.json` as `config.json`.
* Change `NODE_ENV` in `config.json` to `production`.
* Fill your firebase data in `config.json`.

### Run local server ###
```sh
$ npm install
$ npm start # Server will listen 3000 port.
or
$ PORT={port} npm start # Server will listen {port} port.
```

### Deploy to Firebase ###
```sh
$ npm install
$ npm install -g firebase-tools
$ firebase login
$ npm run deploy
```
