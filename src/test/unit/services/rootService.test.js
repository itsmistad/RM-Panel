'use strict';

require('chai').should();

const RootService = require('../../../services/rootService');

describe('[UNIT] rootService', function() {
    it('should export service', function() {
        RootService.should.be.a('Function');
    });
});