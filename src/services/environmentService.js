'use strict';

/*
 * This service exposes the "application" variables through the ConfigService.
 */

let config;

class EnvironmentService {
    constructor(root) {
        config = root.config['application'];
    }

    get isProd() {
        return config['environment'] === 'prod';
    }

    get isLocal() {
        return config['environment'] === 'local';
    }

    get build() {
        return config['travis_build'];
    }

    get version() {
        return config['version'];
    }
}

module.exports = EnvironmentService;