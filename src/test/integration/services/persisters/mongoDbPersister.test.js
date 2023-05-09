'use strict';

const chai = require('chai');
chai.should();

const IntegrationTest = require('../../integrationTest');
function generateRandomName() { 
    let ans = '', arr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    for (let i = 10; i > 0; i--) 
        ans += arr[Math.floor(Math.random() * arr.length)]; 
    return ans; 
}
const name = generateRandomName();
let mongo;

describe('[INTEGRATION] mongoDbPersister', function() {
    before(function() {
        IntegrationTest.Setup();
        IntegrationTest.SetJsonConfig({
            database: {
                mongo: {
                    host: 'localhost',
                    port: '27017',
                    auth: false,
                    user: '',
                    pass: ''
                }
            }
        });
        mongo = IntegrationTest.Root.mongo;
    });
    describe('#save()', function() {
        it('New name saved to users database', function(done) {
            mongo.save('users',{name})
                .then(res => {
                    res.ok.should.equal(1);
                    done();
                }).catch(err => {
                    done(err);
                });
        });
    });
    describe('#delete()', function() {
        it('New name deleted (one) from users database', function(done) {
            mongo.delete('users',{name})
                .then(res => {
                    res.ok.should.equal(1);
                    done();
                }).catch(err => {
                    done(err);
                });
        });
    });
    describe('#deleteMany()', function() {
        it('New name deleted (many) from users database', function(done) {
            mongo.deleteMany('users',{name})
                .then(res => {
                    res.ok.should.equal(1);
                    done();
                }).catch(err => {
                    done(err);
                });
        });
    });
});