const Application = require('../models/Application'),
    Device = require('../models/Device'),
    Version = require('../models/Version'),
    debug = require('debug')('iot-admin-api:devicesCtrl'),
    _ = require('lodash');

module.exports.search = function(req, res) {
    debug('search - begin');
    let query = {};
    if(!_.isNil(req.query.thing)) {
        query._thing = req.query.thing || null;
    }
    else if (!_.isNil(req.query.application)) {
        query._application = req.query.application || null ;
        if(!_.isNil(req.query.version)) {
            query._version = req.query.version || null;
        }
    }
    Device.find(query).exec()
        .then(function(docs) {
            res.json(docs);
        }, function(err) {
            debug('search error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('search - end');
        });
};

module.exports.add = function(req, res) {
    debug('add - begin');
    let doc = new Device(req.body);
    doc.save()
        .then(function() {
            res.status(201).json(doc);
        }, function(err) {
            debug('add save error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('add - end');
        });
};

module.exports.get = function(req, res) {
    debug('get - begin');
    req.device
        .populate('_thing')
        .populate('_application')
        .populate('_version')
        .execPopulate()
        .then(function(doc) {
            res.status(200).json(doc);
        }, function(err) {
            debug('get populate error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('get - end');
        });
};

module.exports.remove = function(req, res) {
    debug('remove - begin');
    Device.findByIdAndRemove(req.device._id).exec()
        .then(function(docs) {
            res.sendStatus(204);
        }, function (err) {
            debug('remove error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('remove - end');
        });
};

module.exports.modify = function(req, res) {
    debug('modify - begin');
    req.body.updated_at = Date.now();
    Device.findByIdAndUpdate(req.device._id, req.body, {new: true}).exec()
        .then(function(newDoc) {
            res.json(newDoc);
        }, function(err) {
            debug('modify error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('modify - end');
        });
};

module.exports.register = function(req, res) {
    debug('register - begin');

    let update = {
        mac: req.body.mac,
        ssid: req.body.ssid,
        ip: req.body.ip,
        last_register: Date.now(),
        plateform: req.body.plateform
    };

    Application.findOne({ name: req.body.application }).exec()
        .then(function(app) {
            if(!app) {
                debug(`register find application error, unknown application [${req.body.application}]`);
                return Promise.reject(`register find application error, unknown application [${req.body.application}]`);
            }
            update._application = app._id;
            return app;
        }, function (err) {
            debug('register find application error', err);
            return Promise.reject(err);
        })
        .then(function(app) {
            return Version.findOne({ name: req.body.version, _application: app._id }).exec();
        }, function (err) {
            debug('register unknown error', err);
            return Promise.reject(err);
        })
        .then(function(vers) {
            if(!vers) {
                debug(`register find version error, unknown version [${req.body.version}], will create it`);
                let newVersion = {
                    name: req.body.version,
                    plateform: req.body.plateform,
                    _application: update._application
                };
                let newDoc = new Version(newVersion)
                update._version = newDoc._id;
                return newDoc.save();
            }
            update._version = vers._id;
        }, function (err) {
            debug('register find version error', err);
            // Do not reject here, so the update will always occurs, also without application or version
        })
        .then(function() {
            return Device.findOneAndUpdate({ mac: req.body.mac }, update, {setDefaultsOnInsert: true, new: true, upsert:true }).exec();
        })
        .then(function(updatedDevice) {
            res.sendStatus(204);
        }, function (err) {
            debug('register update device error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('register - end');
        });
};

