'use strict';

const MockLogService = require('./mockLogService');

class MockRootService {
    constructor() {
        this.config = {};
        this.log = new MockLogService();
    }
}

module.exports = MockRootService;