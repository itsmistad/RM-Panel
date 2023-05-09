'use strict';
const configKeys = require('../../services/config/configKeys');

module.exports = new function() {
    this.desc = `Inserts ${JSON.stringify(configKeys.logging.level)} into the "config" collection.`;

    this.up = async function(m) {
        await m.save('config', {
            key: configKeys.logging.level.key,
            value: configKeys.logging.level.defaultValue
        });
    };

    this.down = async function() {
    };
};