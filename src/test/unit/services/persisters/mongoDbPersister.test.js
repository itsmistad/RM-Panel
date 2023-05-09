'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

const MongoDbPersister = require('../../../../services/persisters/mongoDbPersister');
const UnitTest = require('../../unitTest');

let mongo;

describe('[UNIT] mongoDbPersister', function() {
    before(function() {
        UnitTest.Setup();
        UnitTest.SetJsonConfig({
            database: {
                mongo: {
                    host: 'host',
                    port: '0',
                    auth: true,
                    user: 'user',
                    pass: 'pass'
                }
            }
        });
        mongo = new MongoDbPersister(UnitTest.Root);
    });

    it('should export service', function() {
        MongoDbPersister.should.be.a('Function');
    });

    describe('#connect()', function() {
        it('should attempt to connect to the database', function(done) {
            const stub = sinon.stub(mongo._mongoClient, 'connect');
            stub.returns(Promise.resolve({
                db: () => {},
                close: () => {}
            }));
            mongo.connect().then(function() {
                const mongoConfig = UnitTest.Root.config.database.mongo;
                stub.should.have.been.calledWith(`mongodb://${mongoConfig.user}:${mongoConfig.pass}@${mongoConfig.host}:${mongoConfig.port}/`);
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});