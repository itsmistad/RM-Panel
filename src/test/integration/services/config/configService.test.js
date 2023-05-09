'use strict';

const chai = require('chai');
chai.should();
const expect = chai.expect;

const ConfigService = require('../../../../services/config/configService');
const configKeys = require('../../../../services/config/configKeys');
const IntegrationTest = require('../../integrationTest');
let config, mongo;

describe('[INTEGRATION] configService', function() {
    before(function() {
        IntegrationTest.Setup();
        config = IntegrationTest.Root.config;
        mongo = IntegrationTest.Root.mongo;
    });

    it('should export service', function() {
        ConfigService.should.be.a('Function');
    });

    describe('#load()', function() {
        it('should map config.json and package.json into the service', function() {
            config.load();
            config['application'].should.not.be.undefined;
            config['application']['version'].should.be.a('string');
            config['application']['environment'].should.be.a('string');
        });
    });

    describe('#get()', function() {
        it('should retrieve Logging.Level from the "config" collection', async function() {
            let result;

            // Check if the config key entry is in the collection.
            result = await mongo.find('config', {
                key: configKeys.logging.level.key
            }); 

            if (result != null) {
                // If it's present, store the current value and replace it.
                const previousVal = result.value;
                await mongo.replace('config', result._id, {
                    key: configKeys.logging.level.key,
                    value: -1
                });

                // Get the config value through config.get() and then replace with original value.
                const configResult = await config.get(configKeys.logging.level);
                await mongo.replace('config', result._id, {
                    key: configKeys.logging.level.key,
                    value: previousVal
                });
                
                configResult.should.equal(-1);
            } else console.error('Logging.Level doesn\'t exist in "config" - did you forget to run migrations?');
            expect(result).to.not.be.undefined;
            expect(result).to.not.be.null;
        });
    });
});