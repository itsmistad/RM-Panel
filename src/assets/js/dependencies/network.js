/*
 * network.js
 * 
 * This script contains a bundle wrapper for both ajax and socket.io functionality.
 * 
 * Usage for socket.io:
 *  - network.on('eventName', json => { console.log(JSON.stringify(json)); }).send(...).on(...); // Allows .send and .on chaining; this function will automatically connect for you!
 *  - network.send('eventName', json, err => { console.error(err); }); // Allows for queueing - any messages emitted before a connection is established will be emitted the moment we connect.
 *  
 *  Usage for ajax:
 *  - network.post('/route/to/method', json, json => { console.log(JSON.stringify(json)); });
 *  - network.get('/route/to/method', json, json => { console.log(JSON.stringify(json)); });
 * 
 *  To enable debug messaging, set network.debug to true before any *.on() calls.
 * 
 *  Note: "json" is a json object, not a string.
 */

const network = new function() {
    let obj = {};
    let connection, queue, events = [];
    const log = m => obj.debug ? console.log(m) : {};
    const logErr = e => obj.debug ? console.error(e) : {};

    obj.debug = false;

    obj.on = (event, func) => {
        if (!connection && io) {
            connection = io();
            if (connection) {
                log('Connected successfully!');
                if (queue) {
                    for (let i = 0; i < queue.length; i++) {
                        let queueParams = queue.shift();
                        obj.send(queueParams.event, queueParams.json, queueParams.callback);
                    }
                    queue = null;
                }
            } else {
                logErr('Failed to connect through socket.io!');
            }
        }

        if (connection && !events.includes(event)) {
            connection.on(event, json => {
                log(`Received ${event}: ${JSON.stringify(json)}`);
                if (func) func(json);
            });
            events.push(event);
        }
        return obj;
    };

    obj.send = (event, json, callback) => {
        if (!connection) { // Allows queueing while a connection is being established.
            if (!queue) queue = [];
            queue.push({
                event, json, callback
            });
            return; 
        }
        var str = JSON.stringify(json);
        log(`Sending ${event}: ${str}`);
        connection.emit(event, json, callback);
        return obj;
    };

    obj.upload = (route, formSelector, xhr, func, async) => {
        if (!func) func = () => {};
        let formData = new FormData($(formSelector)[0]);
        $.ajax({
            type: "POST",
            url: route,
            data: formData,
            xhr,
            async: async || false,
            cache: false,
            contentType: false,
            processData: false,
            success: response => {
                log('UPLOAD Success - ' + JSON.stringify(response));
                func(response);
            },
            failure: response => {
                logErr('UPLOAD Failure - ' + JSON.stringify(response));
                func(response);
            },
            error: response => {
                logErr('UPLOAD Error - ' + JSON.stringify(response));
                func(response);
            },
            timeout: 60000
        });  
    };

    obj.post = (route, json, func, async) => {
        if (!func) func = () => {};
        $.ajax({
            type: "POST",
            url: route,
            data: JSON.stringify(json),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: response => {
                log('POST Success - ' + JSON.stringify(response));
                func();
            },
            failure: response => {
                logErr('POST Failure - ' + JSON.stringify(response));
                func(response);
            },
            error: response => {
                logErr('POST Error - ' + JSON.stringify(response));
                func(response);
            },
            async: async || false,
            timeout: 60000
        });  
    };

    obj.get = (route, json, func, async) => {
        if (!func) func = () => {};
        $.ajax({
            type: "GET",
            url: route,
            data: JSON.stringify(json),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: response => {
                log('GET Success - ' + JSON.stringify(response));
                func(response);
            },
            failure: response => {
                logErr('GET Failure - ' + JSON.stringify(response));
                func(response);
            },
            error: response => {
                logErr('GET Error - ' + JSON.stringify(response));
                func(response);
            },
            async: async || false,
            timeout: 60000
        });
    };

    return obj;
}