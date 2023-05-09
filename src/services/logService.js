'use strict';

const configKeys = require('./config/configKeys');
let mongo, config, _loggingLevel;

/*
 * This service implements 3 methods for logging: info, error, and debug.
 * Simply call the method with your specified message.
 * To add formatting, insert any property from "this.root.log.colors" before the text you desire to format.
 */

class LogService {
    constructor(root) {
        mongo = root.mongo;
        config = root.config;
        _loggingLevel = 3;
        this.colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            underscore: '\x1b[4m',
            blink: '\x1b[5m',
            reverse: '\x1b[7m',
            hidden: '\x1b[8m',
            black: '\x1b[30m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            bg_black: '\x1b[40m',
            bg_red: '\x1b[41m',
            bg_green: '\x1b[42m',
            bg_yellow: '\x1b[43m',
            bg_blue: '\x1b[44m',
            bg_magenta: '\x1b[45m',
            bg_cyan: '\x1b[46m',
            bg_white: '\x1b[47m'
        };
        config.get(configKeys.logging.level).then(result => {
            _loggingLevel = result;
        });
    }

    filterColorTags(message) {
        let result = message;
        for (const tag in this.colors) {
            result = result.replace(this.colors[tag], '');
        }
        return result;
    }

    log(tag, message, colorTag = '') {
        let resetTag = colorTag !== '' ? this.colors.reset : '';
        console.log(`${this.colors.underscore}[${new Date().toISOString()}]${this.colors.reset} ${colorTag}[${tag}]\t${message}${resetTag}`);
        return message;
    }

    error(message, skipDbSave) {
        const loggingLevel = !skipDbSave ? _loggingLevel: 3;
        return new Promise((resolve, reject) => {
            try {
                if (loggingLevel >= 1) {
                    const obj = {
                        time: new Date(),
                        type: 'ERROR',
                        message: this.filterColorTags(message)
                    };
                    this.log(obj.type, message, this.colors.red + this.colors.bright);
                    if (!skipDbSave) mongo.save('logs', obj);
                }
                resolve(message);
            } catch (ex) {
                reject(ex);
            }
        });
    }
    
    info(message, skipDbSave) {
        const loggingLevel = !skipDbSave ? _loggingLevel : 3;
        return new Promise((resolve, reject) => {
            try {
                if (loggingLevel >= 2) {
                    const obj = {
                        time: new Date(),
                        type: 'INFO',
                        message: this.filterColorTags(message)
                    };
                    this.log(obj.type, message, this.colors.white + this.colors.bright);
                    if (!skipDbSave) mongo.save('logs', obj);
                }
                resolve(message);
            } catch (ex) {
                reject(ex);
            }
        });
    }
    
    debug(message, skipDbSave) {
        const loggingLevel = !skipDbSave ? _loggingLevel : 3;
        return new Promise((resolve, reject) => {
            try {
                if (config['log']['debug'] && loggingLevel >= 3) {
                    const obj = {
                        time: new Date(),
                        type: 'DEBUG',
                        message: this.filterColorTags(message)
                    };
                    this.log(obj.type, message, this.colors.yellow + this.colors.bright);
                    if (!skipDbSave) mongo.save('logs', obj);
                }
                resolve(message);
            } catch (ex) {
                reject(ex);
            }
        });
    }
}

module.exports = LogService;