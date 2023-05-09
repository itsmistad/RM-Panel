'use strict';
const configKeys = require('../../services/config/configKeys');

module.exports = new function() {
    this.desc = `Inserts ${JSON.stringify(configKeys.web.port)} into the "config" collection.`;

    this.up = async function(m) {
        await m.save('config', {
            key: configKeys.web.port.key,
            value: configKeys.web.port.defaultValue
        });
    };

    this.down = async function() {
    };
};