'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

const S3Persister = require('../../../../services/persisters/s3Persister');
const UnitTest = require('../../unitTest');
let s3;

describe('[UNIT] s3Persister', function() {
    before(function() {
        UnitTest.Setup();
        UnitTest.SetJsonConfig({
            database: {
                mongo: {
                    host: 'host',
                    port: 0,
                    user: 'user',
                    pass: 'pass',
                    auth: true
                }
            }
        });
        s3 = new S3Persister(UnitTest.Root);
    });

    it('should export service', function() {
        S3Persister.should.be.a('Function');
    });

    describe('#get()', function() {
        it('should attempt to retrieve a file from an S3 bucket', function(done) {
            // setup
            const stub = sinon.stub(s3._s3, 'getObject');
            const resultingPromise = Promise.resolve({
                Body: 'Body'
            });
            stub.returns({
                promise: () => resultingPromise
            });

            // execute
            s3.get('Key').then(data => {
                // assert
                data.should.equal('Body');
                done();
            });
        });
    });

    describe('#save()', function() {
        it('should attempt to save a file to an S3 bucket', function(done) {
            // setup
            const stub = sinon.stub(s3._s3, 'putObject');
            const resultingPromise = Promise.resolve({
                res: 'ok'
            });
            stub.returns({
                promise: () => resultingPromise
            });

            // execute
            s3.save('Key', 'Body').then(data => {
                // assert
                data.should.deep.equal({
                    res: 'ok'
                });
                done();
            });
        });
    });
});