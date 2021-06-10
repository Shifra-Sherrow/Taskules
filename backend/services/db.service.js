const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const dbName = 'trello-db';
var dbConn = null;

async function getCollection(collectionName) {
    const db = await _connect();
    return db.collection(collectionName);
}

module.exports = {
    getCollection
};

// private functions

async function _connect() {
    if (dbConn) return dbConn;
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true });
        const db = client.db(dbName);
        dbConn = db;
        return db;
    } catch (err) {
        console.log('Cannot Connect to DB', err);
        throw err;
    }
}