// index.js
'use strict';
import Express from 'express';

const isProd = process.env.NODE_ENV === 'production';
const WEB_PORT = process.env.PORT || 3000;
const expressStaticRoutes = [
    {path: '/img/', serverPath: '/../client/img'},
    {path: '/css/', serverPath: '/../client/css'},
    {path: '/js/', serverPath: '/../client/js'},
    {path: '/firebase-messaging-sw.js', serverPath: '/../../dist/client/js/firebase-messaging-sw.js'},
];
const renderApp = ({ room }) => `
    <!doctype html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width">
            <meta name="viewport" content="initial-scale=1.0">
            <title>${room} | rrf-chatroom</title>

            ${isProd ? '<link rel="stylesheet" href="/css/bundle.css"/>' : ''}
        </head>
        <body>
            <div id="app-root"></div>
            <script type='text/javascript' src="${isProd ? `/js/bundle.js` : `http://localhost:7000/js/bundle.js`}" ></script>
        </body>
    </html>
`;
const app = Express();

expressStaticRoutes.forEach(function(route) {
    app.use(route.path, Express.static(__dirname + route.serverPath));
});
app.get('/', (req, res) => { res.send(renderApp({room: 'lobby'})); })
app.get('/:room', (req, res) => {
    const { room } = req.params;
    res.send(renderApp({ room }));
})
app.listen(WEB_PORT);
