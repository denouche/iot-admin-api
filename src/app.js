'use strict';

var express = require('express'),
    mongo = require('./mongo'),
    webApp = express(),
    apiApp = require('./api/api'),
    debug = require('debug')('iot-admin-api:app'),
    errorhandler = require('errorhandler');

mongo();

webApp.set('port', process.env.LISTEN_PORT || 3000);
webApp.use(apiApp);

var env = process.env.NODE_ENV || 'development';
if ('production' == env) {
    webApp.use(errorhandler({dumpExceptions: false, showStack: false}));
}
else if ('development' == env) {
    webApp.use(errorhandler({dumpExceptions: true, showStack: true}));
}


webApp.listen(webApp.get('port'), process.env.LISTEN_ADDRESS || '127.0.0.1');
debug("Started in " + webApp.settings.env + " on port " + webApp.get('port'));
