'use strict';

class MockLogService {
    constructor() {
    }

    log(tag, message) {
        const colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            underscore: '\x1b[4m',
            magenta: '\x1b[35m',
        };
        console.log(`${colors.underscore}[${new Date().toISOString()}]${colors.reset} ${colors.bright + colors.magenta}[${tag}]\t${message}${colors.reset}`);
        return message;
    }
    
    info(message) {
        this.log('INFO', message);
        return message;
    }

    error(message) {
        this.log('ERROR', message);
        return message;
    }
    
    debug(message) {
        this.log('DEBUG', message);
        return message;
    }
}

module.exports = MockLogService;