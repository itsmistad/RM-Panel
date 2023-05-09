'use strict';

const AWS = require('aws-sdk');
let log;

class S3Persister {
    constructor(root) {
        this._s3 = new AWS.S3();
        this._bucketName = root.env.isProd ? 'rmpanel-app-prod' : 'rmpanel-app-dev';
        log = root.log;
    } 

    /*
     * contentEncoding is an optional flag that defaults to "utf-8". Another acceptable value is "binary", for example.
     * This can be changed to other content types per this documentation:
     * https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end
     */
    get(key, contentEncoding = 'utf-8') {
        const params = {
            Bucket: this._bucketName,
            Key: key
        };
        var getObjectPromise = this._s3.getObject(params).promise();
        return getObjectPromise.then(data => {
            return data.Body.toString(contentEncoding);
        }).catch(err => log.error(`Failed to retrieve item with key "${key}" from bucket "${this._bucketName}". Error: ${err}`));
    }

    save(key, body, contentEncoding = 'utf-8') {
        const params = {
            Bucket: this._bucketName,
            Key: key,
            Body: body,
            ContentType: 'binary',
            ContentEncoding: contentEncoding
        };
        var putObjectPromise = this._s3.putObject(params).promise();
        return putObjectPromise.then(data => {
            return data;
        }).catch(err => log.error(`Failed to save item with key "${key}" to bucket "${this._bucketName}". Error: ${err}`));
    }

    delete(key) {
        const params = {
            Bucket: this._bucketName,
            Key: key
        };
        var deleteObjectPromise = this._s3.deleteObject(params).promise();
        return deleteObjectPromise.then(data => {
            return data;
        }).catch(err => log.error(`Failed to delete item with key "${key}" from bucket "${this._bucketName}". Error: ${err}`));
    }
}

module.exports = S3Persister;