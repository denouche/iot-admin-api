var Thing = require('../models/Thing'),
    Device = require('../models/Device'),
	debug = require('debug')('iot-admin-api:thingsCtrl');

module.exports.list = function(req, res) {
	debug('list - begin');
    Thing.find({}, function (err, docs) {
        if(err) { res.status(500).send(err); }
        else {
            res.json(docs);
        }
    });
    debug('list - end');
};

module.exports.add = function(req, res) {
	debug('add - begin');
	debug(req.body)
	let doc = new Thing(req.body)
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
    res.status(200).json(req.thing);
    debug('get - end');
};

module.exports.modify = function(req, res) {
    debug('modify - begin');
    req.body.updated_at = Date.now();
    Thing.findByIdAndUpdate(req.thing._id, req.body, {new: true}, function(err, newDoc) {
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
    Device.find({ _thing: req.thing._id }, function (err, docs) {
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

