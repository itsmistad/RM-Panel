'use strict';

const chai = require('chai');
chai.should();

const IntegrationTest = require('../../integrationTest');
let s3;

describe('[INTEGRATION] s3Persister', function() {
    before(function() {
        IntegrationTest.Setup();
        s3 = IntegrationTest.Root.s3;
    });
    describe('#save()', function() {
        it.skip('should save a file to an S3 bucket', function(done) {
            let timeout;
            timeout = setTimeout(() => done('Failed to save the test file within 10 seconds. Is our S3 bucket online?'), 9950);
            s3.save('TestFile', 'content').then(() => {
                clearTimeout(timeout);
                timeout = null;
                done();
            }).catch(err => {
                done(err);
            });
        });
    });

    describe('#get()', function() {
        it.skip('should retrieve a file from an S3 bucket', function(done) {
            let timeout;
            timeout = setTimeout(() => done('Failed to retrieve the test file within 10 seconds. Is our S3 bucket online?'), 9950);
            s3.get('TestFile').then(() => {
                clearTimeout(timeout);
                timeout = null;
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});