var Application = require('../models/Application'),
    Device = require('../models/Device'),
    Version = require('../models/Version'),
	debug = require('debug')('iot-admin-api:applicationsCtrl');

module.exports.list = function(req, res) {
	debug('list - begin');
    Application.find({}, function (err, docs) {
        if(err) {
            debug('list error', err);
            res.status(500).send(err);
        }
        else {
            res.json(docs);
        }
        debug('list - end');
    });
};

module.exports.add = function(req, res) {
	debug('add - begin');
	let doc = new Application(req.body)
    console.log('doc', doc)
    doc.save(function(err) {
        if(err) { 
        	debug('add save error', err);
        	res.status(500).send(err);
        }
        else {
            res.status(201).json(doc);
        }
    	debug('add - end');
    });
};

module.exports.get = function(req, res) {
    debug('get - begin');
    res.status(200).json(req.application);
    debug('get - end');
};

module.exports.modify = function(req, res) {
    debug('modify - begin');
    req.body.updated_at = Date.now();
    Application.findByIdAndUpdate(req.application._id, req.body, {new: true}, function(err, newDoc) {
        if(err) {
            debug('modify error', err);
            res.status(500).send(err);
        }
        else {
            res.json(newDoc);
        }
        debug('modify - end');
    });
};

module.exports.getDevices = function(req, res) {
    debug('getDevices - begin');
    Device.find({ _application: req.application._id }, function (err, docs) {
        if(err) {
            debug('getDevices error', err);
            res.status(500).send(err);
        }
        else {
            res.json(docs);
        }
        debug('getDevices - end');
    });
};

module.exports.getVersions = function(req, res) {
    debug('getVersions - begin');
    Version.find({ _application: req.application._id }, function (err, docs) {
        if(err) {
            debug('getVersions error', err);
            res.status(500).send(err);
        }
        else {
            res.json(docs);
        }
        debug('getVersions - end');
    });
};

