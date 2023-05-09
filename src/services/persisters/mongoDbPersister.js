'use strict';

/*
 * This service allows you to save and retrieve data with the app's MongoDB instance.
 * Connection configuration is pulled from ./config/config.json
 */

const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

let config, databaseConfig, mongoConfig;

class MongoDbPersister {
    constructor(root) {
        config = root.config;
        databaseConfig = config['database'];
        mongoConfig = databaseConfig['mongo'];
        this._log = root.log;
        this._mongoClient = mongodb.MongoClient;
    }

    connect() {
        const host = mongoConfig.host;
        const port = mongoConfig.port;
        const user = mongoConfig.user;
        const pass = mongoConfig.pass;
        const auth = mongoConfig.auth;

        let url = 'mongodb://' +
            (auth ? `${user}:${pass}@` : '') +
            `${host}:${port}/`;

        return this._mongoClient.connect(url, {useUnifiedTopology: true}).then(db => {
            const dbo = db.db('rmpanel');
            return {
                done: () => db.close(),
                o: dbo
            };
        }).catch(err => this._log.error('Failed to connect to database. Exception: ' + err, true));
    }

    get(collection, id) {
        return this.connect().then(db => {
            this._log.debug(`Retrieving ${id} from ${collection}`, true);
            return db.o.collection(collection).findOne({
                _id: ObjectId(id)
            }).then(res => {
                db.done();
                return res;
            }).catch(() => this._log.error(`Failed to get item with "${id}".`, true));
        });
    }

    save(collection, data) {
        return this.connect().then(db => {
            const str = JSON.stringify(data);
            this._log.debug(`Saving ${str} to ${collection}`, true);
            return db.o.collection(collection).insertOne(data)
                .then(res => {
                    db.done();
                    let returnObj = {
                        insertedId: res.insertedId,
                        ok: 1
                    };
                    return returnObj;
                }).catch(() => this._log.error(`Failed to save item: ${str}`, true));
        });
    }
    
    update(collection, query, data, upsert) {
        return this.connect().then(db => {
            const str = JSON.stringify(data);
            this._log.debug(`Updating ${str} to ${collection}`, true);
            return db.o.collection(collection).updateOne(query, data, {
                upsert: !upsert ? false : true
            })
                .then(res => {
                    db.done();
                    let returnObj = {
                        modifiedCount: res.modifiedCount,
                        ok: 1
                    };
                    return returnObj;
                }).catch((ex) => this._log.error(`Failed to update item: ${ex}`, true));
        });
    }
    
    updateMany(collection, query, data, upsert) {
        return this.connect().then(db => {
            const str = JSON.stringify(data);
            this._log.debug(`Updating ${str} to ${collection}`, true);
            return db.o.collection(collection).updateMany(query, data, {
                upsert: !upsert ? false : true
            })
                .then(res => {
                    db.done();
                    let returnObj = {
                        modifiedCount: res.modifiedCount,
                        ok: 1
                    };
                    return returnObj;
                }).catch(() => this._log.error(`Failed to update item: ${str}`, true));
        });
    }

    replace(collection, id, data, upsert) {
        return this.connect().then(db => {
            const str = JSON.stringify(data);
            this._log.debug(`Replacing ${str} in ${collection}`, true);
            return db.o.collection(collection).replaceOne({
                _id: ObjectId(id)
            }, data, {
                upsert: !upsert ? false : true
            })
                .then(res => {
                    db.done();
                    let returnObj = {
                        modifiedCount: res.modifiedCount,
                        ok: 1
                    };
                    return returnObj;
                }).catch(() => this._log.error(`Failed to replace item "${id}": ${str}`, true));
        });
    }

    find(collection, data) {
        return this.connect().then(db => {
            const str = JSON.stringify(data);
            this._log.debug(`Finding ${str} (one) in ${collection}`, true);
            return db.o.collection(collection).findOne(data)
                .then(res => {
                    db.done();
                    return res;
                }).catch(() => this._log.error(`Failed to find any item with ${str}.`, true));
        });
    }

    findMany(collection, data) {
        return this.connect().then(db => {
            const str = JSON.stringify(data);
            this._log.debug(`Finding ${str} (many) in ${collection}`, true);
            return db.o.collection(collection).find(data).toArray()
                .then(res => {
                    db.done();
                    return res;
                }).catch(() => this._log.error(`Failed to find items with ${str}.`, true));
        });
    }

    delete(collection, data) {
        return this.connect().then(db => {
            const str = JSON.stringify(data);
            this._log.debug(`Deleting ${str} (one) in ${collection}`, true);
            return db.o.collection(collection).deleteOne(data)
                .then(res => {
                    db.done();
                    let returnObj = {
                        deletedCount: res.deletedCount,
                        ok: 1
                    };
                    return returnObj;
                }).catch(() => this._log.error(`Failed to delete any item with ${str}.`, true));
        });
    }

    deleteMany(collection, data) {
        return this.connect().then(db => {
            const str = JSON.stringify(data);
            this._log.debug(`Deleting ${str} (many) in ${collection}`, true);
            return db.o.collection(collection).deleteMany(data)
                .then(res => {
                    db.done();
                    let returnObj = {
                        deletedCount: res.deletedCount,
                        ok: 1
                    };
                    return returnObj;
                }).catch(() => this._log.error(`Failed to delete items ${str}.`, true));
        });
    }
}

module.exports = MongoDbPersister;