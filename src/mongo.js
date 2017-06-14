'use strict';

const mongoose = require('mongoose'),
    debug = require('debug')('iot-admin-api:mongo');

const mongoUrl = process.env.MONGODB_URL;
    // "gridfs-stream": "^1.1.1",
    //Grid = require('gridfs-stream');

if(!mongoUrl) {
    debug('Missing MONGODB_URL environment variable for mongodb connexion');
    process.exit(1);
}

//Grid.mongo = mongoose.mongo;
mongoose.Promise = global.Promise;

function mongo() {
    mongoose.connect(mongoUrl, function(err) {
        if(err) {
            debug('MongoDB error:', err);
            throw err;
        }
        debug('Connected to MongoDB');
    });
}
module.exports = mongo;

