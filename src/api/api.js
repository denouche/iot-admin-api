'use strict';

var express = require('express'),
    apiApp = express(),
    debug = require('debug')('iot-admin-api:api'),
    bodyParser = require('body-parser'),
    _ = require('lodash');

apiApp.use(bodyParser.json());

apiApp.all('/*', function (req, res, next) {
    debug(req.method + ' ' + req.url);
    next();
});

const routes = {
    '/download':              __dirname + '/routes/download',
    '/devices':         __dirname + '/routes/devices',
    '/applications':    __dirname + '/routes/applications',
    '/things':          __dirname + '/routes/things',
    '/versions':        __dirname + '/routes/versions'
}
_.forEach(routes, (value, key) => {
    let router = express.Router();
    let routeImport = require(value)
    routeImport(router);
    apiApp.use(key, router);
});

// error handling
apiApp.use(function(err, req, res, next) {
    switch(err.status) {
        case 100:
            res.sendStatus(400);
            break;
        default:
            debug('################ ERROR #######################');
            debug(err.status);
            debug(err.stack);
            debug('##############################################');
            res.sendStatus(500);
            break;
    }
});

module.exports = apiApp;

