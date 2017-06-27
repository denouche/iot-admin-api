const Thing = require('../models/Thing'),
    Device = require('../models/Device'),
	debug = require('debug')('iot-admin-api:thingsCtrl');

module.exports.list = function(req, res) {
	debug('list - begin');
    Thing.find({}).exec()
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
	let doc = new Thing(req.body);
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
    res.status(200).json(req.thing);
    debug('get - end');
};

module.exports.remove = function(req, res) {
    debug('remove - begin');
    Thing.findByIdAndRemove(req.thing._id).exec()
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
    Thing.findByIdAndUpdate(req.thing._id, req.body, {new: true}).exec()
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

module.exports.getDevices = function(req, res) {
    debug('getDevices - begin');
    Device.find({ _thing: req.thing._id }).exec()
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

