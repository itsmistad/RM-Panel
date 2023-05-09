'use strict';

require('chai').should();

const EnvironmentService = require('../../../services/environmentService');
const UnitTest = require('../unitTest');

describe('[UNIT] environmentService', function() {
    before(function() {
        UnitTest.Setup();
    });

    describe('#isProd()', function() {
        it('should return true when environment is "prod"', function() {
            // setup
            UnitTest.SetJsonConfig({
                application: {
                    environment: 'prod'
                }
            });
            const env = new EnvironmentService(UnitTest.Root);
            // execute
            const result = env.isProd;
            // assert
            result.should.be.true;
        });
    });

    describe('#isLocal()', function() {
        it('should return true when environment is "local"', function() {
            // setup
            UnitTest.SetJsonConfig({
                application: {
                    environment: 'local'
                }
            });
            const env = new EnvironmentService(UnitTest.Root);
            // execute
            const result = env.isLocal;
            // assert
            result.should.be.true;
        });
    });

    describe('#build()', function() {
        it('should return the build when set to "123" in the config', function() {
            // setup
            UnitTest.SetJsonConfig({
                application: {
                    travis_build: 123
                }
            });
            const env = new EnvironmentService(UnitTest.Root);
            // execute
            const result = env.build;
            // assert
            result.should.equal(123);
        });
    });

    describe('#version()', function() {
        it('should return the version when set to "0.0.1" in the config', function() {
            // setup
            UnitTest.SetJsonConfig({
                application: {
                    version: '0.0.1'
                }
            });
            const env = new EnvironmentService(UnitTest.Root);
            // execute
            const result = env.version;
            // assert
            result.should.equal('0.0.1');
        });
    });
});