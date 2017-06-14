var Version = require('../models/Version'),
    Device = require('../models/Device'),
	debug = require('debug')('iot-admin-api:versionsCtrl');

module.exports._populate = function(doc) {
    return doc
        .populate('_application')
        .execPopulate();
};

module.exports.add = function(req, res) {
	debug('add - begin');
	debug(req.body)
	let doc = new Version(req.body)
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
    module.exports._populate(req.version)
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

module.exports.modify = function(req, res) {
    debug('modify - begin');
    req.body.updated_at = Date.now();
    Version.findByIdAndUpdate(req.version._id, req.body, {new: true}, function(err, newDoc) {
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
    module.exports._populate(req.version)
        .then(function(version) {
            Device.find({ _application: version._application._id, _version: version._id }, function (err, docs) {
                if(err) {
                    debug('getDevices error', err);
                    res.status(500).send(err);
                }
                else {
                    res.json(docs);
                }
            });
        }, function(err) {
            debug('getDevices populate error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('getDevices - end');
        });
};

