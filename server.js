const path = require('path');
const express = require("express");
const http = require('http');
const socketIO = require('socket.io');

const fs = require('fs');

exports.createServer = () => {
    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);

    const HOST = "127.0.0.1";
    const PORT = 8080;
    const APP_PATH = path.join(__dirname + '/app');

    // Log requests
    app.use('*', (req, res, next) => {
        console.log(` ~ express server: request: ${req.originalUrl}`);
        next();
    });

    app.get("*", function(req, res) {
        let relativePath = req.originalUrl;

        if (!relativePath || relativePath === '/') {
            relativePath = '/index.html';
        }

        const fileIsHTML = relativePath.endsWith('.html');

        const appPath = path.join(APP_PATH, relativePath);

        fs.readFile(appPath, "utf8", (err, data) => {
            if (err) {
                return res.sendStatus(404);
            } else {
                if (!fileIsHTML) {
                    return res.end(data);
                }

                fs.readFile(path.join(__dirname, '/__live_reload.js'), "utf8", (reloadErr, reloadData) => {
                    if (reloadErr) {
                        return res.sendStatus(500);
                    }

                    let reloadJS = reloadData.trim();

                    const injectionComment = `<!-- live reloading logic using socket.io. Server emits events to notify the client app to refresh when changes are detected in /app -->`;
                    const socketScript = `<script src="/socket.io/socket.io.js"></script>`;

                    const endBody = '</body>';
                    const injectedData = data.replace('</body>', `\n\n\n\n\n\t${injectionComment}\n\t${socketScript}\n\t<script>\n${reloadJS}\n</script>\n${endBody}`);
                    return res.end(injectedData);
                });
            }
        });
    });

    server.listen(PORT, HOST, (() => {
        console.log(` ~ express server: listening at ${HOST}:${PORT}`);
    }));

    return {
        server: server,
        io: io,
    };
};
