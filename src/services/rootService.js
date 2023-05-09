'use strict';

/*
 * This service is meant to be passed around the constructors of the services
 * so that they don't need to import other services or maintain their own instances.
 * 
 * When adding a new service, be sure to include it in this service's constructor.
 */

const MockLogService = require('../test/mocks/mockLogService');
const LogService = require('./logService');
const ConfigService = require('./config/configService');
const EnvironmentService = require('./environmentService');
const MongoDbPersister = require('./persisters/mongoDbPersister');
const S3Persister = require('./persisters/s3Persister');
const AuthenticationService = require('./authenticationService');
const WebService = require('./webService');
const SocketService = require('./socketService');

class RootService {
    constructor() {
        this.config = new ConfigService(this);
        this.config.load();
        this.env = new EnvironmentService(this);
        this.log = new MockLogService(this); // A bit hacky, but it works.
        this.mongo = new MongoDbPersister(this);
        this.log = this.mongo._log = new LogService(this); // A bit hacky, but it works -- part 2.
        this.s3 = new S3Persister(this);
        this.socket = new SocketService(this);
        this.auth = new AuthenticationService(this);
        this.web = new WebService(this);
    }
}

module.exports = RootService;