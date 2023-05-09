'use strict';

const MockRootService = require('../mocks/mockRootService');
const ConfigService = require('../../services/config/configService');
const EnvironmentService = require('../../services/environmentService');
const sinon = require('sinon');
let configStub, dbConfigValues = {};

class UnitTest {
    static Setup() {
        this.Root = new MockRootService();
        this.Root.config = new ConfigService(this.Root);
        this.Root.config.load();
        this.Root.env = new EnvironmentService(this.Root);
        configStub = sinon.stub(this.Root.config, 'get');
        configStub.callsFake(configKey => Promise.resolve(dbConfigValues[configKey.key]));
    }

    static SetJsonConfig(config) {
        for (const key in config) {
            this.Root.config[key] = config[key];
        }
    }

    static SetDbConfig(config) {
        for (const configKey of config) {
            if (configKey.key && configKey.value) {
                dbConfigValues[configKey.key] = configKey.value;
            }
        }
    }

    static SetLoggingFlag(flag) {
        this.Root.log.enable = flag;
    }
}

module.exports = UnitTest;