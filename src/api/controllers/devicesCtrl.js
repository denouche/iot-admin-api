const Device = require('../models/Device'),
	debug = require('debug')('iot-admin-api:devicesCtrl');

module.exports.search = function(req, res) {
	debug('search - begin');
    let query = {};
    if(req.query.thing) {
        query._thing = req.query.thing;
    }
    else if (req.query.application) {
        query._application = req.query.application;
        if(req.query.version) {
            query._version = req.query.version;
        }
    }
    Device.find(query, function (err, docs) {
        if(err) { res.status(500).send(err); }
        else {
            res.json(docs);
        }
        debug('search - end');
    });
};

module.exports.add = function(req, res) {
	debug('add - begin');
	debug(req.body)
	let doc = new Device(req.body)
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
    Device.findByIdAndRemove(req.device._id, function (err) {
        if(err) {
            debug('remove error', err);
            res.status(500).send(err);
        }
        else {
            res.sendStatus(204);
        }
        debug('remove - end');
    });
};

module.exports.modify = function(req, res) {
    debug('modify - begin');
    req.body.updated_at = Date.now();
    Device.findByIdAndUpdate(req.device._id, req.body, {new: true}, function(err, newDoc) {
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
