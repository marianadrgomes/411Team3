const mongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017';

let _db = null;

module.exports = {
    getDB: async dbName => {
        if(_db) { return _db; }
        else {
            let _client = await mongoClient.connect(mongoURL);
            _db = _client.db(dbName);
            return _db;
        }
    }
}
