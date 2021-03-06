const Application = require('../models/Application'),
    Device = require('../models/Device'),
    Version = require('../models/Version'),
    debug = require('debug')('iot-admin-api:applicationsCtrl');

module.exports.list = function(req, res) {
    debug('list - begin');
    Application.find({}).exec()
        .then(function(docs) {
            res.json(docs);
        }, function(err) {
            debug('list error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('list - end');
        });
};

module.exports.add = function(req, res) {
    debug('add - begin');
    let doc;
    Application.findOne({ name: req.body.name }).exec()
        .then(function(app) {
            if(app) {
                debug(`Already existing application [${req.body.name}]`);
                return Promise.reject({status: 409, message: `Another application with the same name already exists`});
            }
            doc = new Application(req.body);
            return doc.save();
        }, function (err) {
            debug('add application application error, search existing application', err);
            return Promise.reject({status: 500, message: err});
        })
        .then(function() {
            res.status(201).json(doc);
        }, function(err) {
            debug('add save error', err);
            res.status(err.status).send({error: err.message});
        })
        .then(function() {
            debug('add - end');
        });
};

module.exports.get = function(req, res) {
    debug('get - begin');
    res.status(200).json(req.application);
    debug('get - end');
};

module.exports.remove = function(req, res) {
    debug('remove - begin');
    Device.update({ _application: req.application._id }, { _application: null, _version: null }, { multi: true }).exec()
        .then(function() {
            return Version.remove({ _application: req.application._id }).exec();
        }, function(err) {
            debug('device updateMany error', err);
            return Promise.reject(err);
        })
        .then(function() {
            return Application.findByIdAndRemove(req.application._id).exec();
        }, function(err) {
            debug('remove versions error', err);
            return Promise.reject(err);
        })
        .then(function() {
            res.sendStatus(204);
            debug('remove - end');
        }, function(err) {
            debug('remove application error', err);
            res.status(500).send(err);
        });
};

module.exports.modify = function(req, res) {
    debug('modify - begin');
    req.body.updated_at = Date.now();
    Application.findOne({ name: req.body.name }).exec()
        .then(function(app) {
            if(app && app._id.toString() !== req.application._id.toString()) {
                debug(`Already existing application [${req.body.name}]`);
                return Promise.reject({status: 409, message: `Another application with the same name already exists`});
            }
            return Application.findByIdAndUpdate(req.application._id, req.body, {new: true}).exec();
        }, function (err) {
            debug('add application application error, search existing application', err);
            return Promise.reject({status: 500, message: err});
        })
        .then(function(newDoc) {
            res.json(newDoc);
        }, function(err) {
            debug('modify error', err);
            res.status(err.status).send({error: err.message});
        })
        .then(function() {
            debug('modify - end');
        });
};

module.exports.getDevices = function(req, res) {
    debug('getDevices - begin');
    Device.find({ _application: req.application._id }).exec()
        .then(function(docs) {
            res.json(docs);
        }, function(err) {
            debug('getDevices error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('getDevices - end');
        });
};

module.exports.getVersions = function(req, res) {
    debug('getVersions - begin');
    Version.find({ _application: req.application._id }).exec()
        .then(function(docs) {
            res.json(docs);
        }, function(err) {
            debug('getVersions error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('getVersions - end');
        });
};

