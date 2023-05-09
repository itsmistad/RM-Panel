'use strict';


class DisconnectHandler {
    constructor() {
        this.event = 'disconnect';
    }

    // eslint-disable-next-line no-unused-vars
    handle(io, client, user, data) {
    }
}

module.exports = DisconnectHandler;