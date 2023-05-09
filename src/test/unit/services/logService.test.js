'use strict';

require('chai').should();
var sinon = require('sinon');

const configKeys = require('../../../services/config/configKeys');
const LogService = require('../../../services/logService');
const MongoDbPersister = require('../../../services/persisters/mongoDbPersister');
const UnitTest = require('../unitTest');
let saveStub, logStub, log;

describe('[UNIT] logService', function() {
    before(function() {
        UnitTest.Setup();
        UnitTest.SetJsonConfig({
            log: {
                debug: true
            },
            database: {
                mongo: null
            }
        });
        UnitTest.Root.mongo = new MongoDbPersister(UnitTest.Root);
        saveStub = sinon.stub(UnitTest.Root.mongo, 'save').callsFake(() => {});
    });

    it('should export service', function() {
        LogService.should.be.a('Function');
    });

    describe('#debug()', function() {
        it('should invoke log() with tag "DEBUG"', function(done) {
        // setup
            UnitTest.SetDbConfig([{
                key: configKeys.logging.level.key,
                value: 3
            }]);
            log = new LogService(UnitTest.Root);
            logStub = sinon.stub(log, 'log').callsFake(() => {});
            // execute
            log.debug('debug').then(data => {
                // assert
                data.should.equal('debug');
                sinon.assert.calledWith(logStub, 'DEBUG', 'debug');
                sinon.assert.calledWithMatch(saveStub, 'logs', {
                    type: 'DEBUG',
                    message: 'debug'
                });
                done();
            }).catch(err => done(err));
        });
    });

    describe('#info()', function() {
        it('should invoke log() with tag "INFO"', function(done) {
        // setup
            UnitTest.SetDbConfig([{
                key: configKeys.logging.level.key,
                value: 2
            }]);
            log = new LogService(UnitTest.Root);
            logStub = sinon.stub(log, 'log').callsFake(() => {});
            // execute
            log.info('info').then(data => {
                // assert
                data.should.equal('info');
                sinon.assert.calledWith(logStub, 'INFO', 'info');
                sinon.assert.calledWithMatch(saveStub, 'logs', {
                    type: 'INFO',
                    message: 'info'
                });
                done();
            }).catch(err => done(err));
        });
    });

    describe('#error()', function() {
        it('should invoke log() with tag "ERROR"', function(done) {
        // setup
            UnitTest.SetDbConfig([{
                key: configKeys.logging.level.key,
                value: 1
            }]);
            log = new LogService(UnitTest.Root);
            logStub = sinon.stub(log, 'log').callsFake(() => {});
            // execute
            log.error('error').then(data => {
                // assert
                data.should.equal('error');
                sinon.assert.calledWith(logStub, 'ERROR', 'error');
                sinon.assert.calledWithMatch(saveStub, 'logs', {
                    type: 'ERROR',
                    message: 'error'
                });
                done();
            }).catch(err => done(err));
        });
    });
});