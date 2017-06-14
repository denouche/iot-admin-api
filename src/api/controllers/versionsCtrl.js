const Version = require('../models/Version'),
    Device = require('../models/Device'),
	debug = require('debug')('iot-admin-api:versionsCtrl'),
    fs = require('fs');

module.exports._populate = function(doc) {
    return doc
        .populate('_application')
        .execPopulate();
};

module.exports.add = function(req, res) {
	debug('add - begin');
	debug(req.body)
	let doc = new Version(req.body)

    let firmwareTempPath = '/home/denouche/tmp/cat.jpg'; // TODO here take the good file, and move this in /version/id/upload function
    doc.firmware.data = fs.readFileSync(firmwareTempPath);

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

module.exports.remove = function(req, res) {
    debug('remove - begin');
    Version.findByIdAndRemove(req.version._id, function (err) {
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

module.exports.downloadFirmware = function(req, res) {
    debug('downloadFirmware - begin');
    module.exports._populate(req.version)
        .then(function(doc) {
            res.attachment(doc._application.name + '_' + doc.name + '.' + doc.plateform + '.bin');
            res.send(doc.firmware.data);
        }, function(err) {
            debug('downloadFirmware populate error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('downloadFirmware - end');
        });
};
