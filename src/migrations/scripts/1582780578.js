'use strict';
const configKeys = require('../../services/config/configKeys');

module.exports = new function() {
    this.desc = `Inserts the following into the "config" collection:
- ${JSON.stringify(configKeys.email.address)}
- ${JSON.stringify(configKeys.email.name)}`;

    this.up = async function(m) {
        await m.save('config', {
            key: configKeys.email.address.key,
            value: configKeys.email.address.defaultValue
        });
        await m.save('config', {
            key: configKeys.email.name.key,
            value: configKeys.email.name.defaultValue
        });
    };

    this.down = async function() {
    };
};