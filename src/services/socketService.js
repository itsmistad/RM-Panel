'use strict';

const path = require('path');
const fs = require('fs');

let http, handlers = [], root, log;

function findByExtension(base,ext,files,result) 
{
    try {
        files = files || fs.readdirSync(base);
        result = result || [];

        files.forEach( 
            function (file) {
                var newbase = path.join(base,file);
                if (fs.statSync(newbase).isDirectory())
                {
                    result = findByExtension(newbase, ext, fs.readdirSync(newbase), result);
                }
                else
                {
                    if (file.substr(-1*(ext.length+1)) == '.' + ext)
                    {
                        result.push(newbase);
                    } 
                }
            }
        );
        return result;
    } catch (ex) {
        log.debug(`Failed to find socket handlers. Exception: ${ex}`);
        return null;
    }
}

class SocketService {
    constructor(_root) {
        root = _root;
        log = root.log;
    }

    setup(app) {
        http = require('http').createServer(app);
        this._io = require('socket.io')(http);
        let paths = ['./services/handlers/socket', './src/services/handlers/socket'];
        let handlerFiles;
        for (let p of paths) {
            handlerFiles = findByExtension(p, 'js');
            if (handlerFiles) break;
        }
        if (handlerFiles != null) {
            handlerFiles = handlerFiles.filter(_ => _.includes('Handler'));
            for (let file of handlerFiles) {
                log.debug(`Found handler: ${file}`);
                let Handler;
                if (root.env.isProd)
                    Handler = require(`../../${file}`);
                else
                    Handler = require(`../${file}`);
                let handler = new Handler(root);
                log.info(`Registering socket.io handler: "${handler.constructor.name}"`);
                handlers.push(handler);
            }
        }
        this._io.on('connection', client => {
            for (let h of handlers) {
                client.on(h.event, data => h.handle(this._io, client, client.request.session.passport ? client.request.session.passport.user || {} : {}, data));
            }
        });
    }

    listen(port, callback) {
        http.listen(port, callback);
    }
}

module.exports = SocketService;