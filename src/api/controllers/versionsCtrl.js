const Version = require('../models/Version'),
    Device = require('../models/Device'),
    Application = require('../models/Application'),
    debug = require('debug')('iot-admin-api:versionsCtrl'),
    fs = require('fs'),
    semver = require('semver');

module.exports._populate = function(doc) {
    return doc
        .populate('_application')
        .execPopulate();
};

module.exports.add = function(req, res) {
    debug('add - begin');
    if(!req.body.name) {
        return res.status(400).json({message: 'missing version name field'});
    }

    let application;

    Application.findOne({ name: req.body.application }).exec()
        .then(function(app) {
            if(!app) {
                debug(`Unknown application [${req.body.application}]`);
                return Promise.reject({status: 400, message: `Unknown application [${req.body.application}]`});
            }
            application = app;
            return Version.find({ _application: application._id, plateform: req.body.plateform})
                .sort({ created_at : -1 })
                .limit(1)
                .exec();
        }, function (err) {
            debug('add version application error, search existing application', err);
            return Promise.reject({status: 500, message: err});
        })
        .then(function(lastVersion) {
            if(!lastVersion || lastVersion.length === 0) {
                // This is the first version of this application
                debug(`no last version found for application ${application._id} and plateform ${req.body.plateform}, apparently it is the first version of this application for this plateform`);
            }
            else if(!semver.gt(req.body.name, lastVersion[0].name)) {
                return Promise.reject({status: 400, message: `You cannot create a version lower than existing ones for this plateform, the latest version is ${lastVersion[0].name}`});
            }
            return Version.find({ _application: application._id, name: req.body.name, plateform: req.body.plateform }).exec();
        }, function(err) {
            debug('add find last version error', err);
            return Promise.reject({status: 500, message: err});
        })
        .then(function(docs) {
            if(docs.length > 0) {
                return Promise.reject({status: 400, message: 'Another version with this name already exists for this application and this plateform'});
            }
        }, function (err) {
            debug('add find error', err);
            return Promise.reject({status: 500, message: err});
        })
        .then(function() {
            let doc = new Version(req.body)
            if(req.file) {
                doc.firmware.data = fs.readFileSync(req.file.path);
            }
            return doc.save();
        }, function(err) {
            return Promise.reject({status: 500, message: err});
        })
        .then(function(doc) {
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
    Device.update({ _version: req.version._id }, { _version: null }, { multi: true }).exec()
        .then(function() {
            return Version.findByIdAndRemove(req.version._id).exec();
        }, function(err) {
            debug('device updateMany error', err);
            return Promise.reject(err);
        })
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

    Version.findByIdAndUpdate(req.version._id, req.body, {new: true}).exec()
        .then(function(newDoc) {
            if(req.file) {
                newDoc.firmware.data = fs.readFileSync(req.file.path);
                return newDoc.save();
            }
            return newDoc;
        })
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
    module.exports._populate(req.version)
        .then(function(version) {
            return Device.find({ _application: version._application._id, _version: version._id }).exec()
                .then(function(docs) {
                    res.json(docs);
                }, function(err) {
                    debug('getDevices error', err);
                    res.status(500).send(err);
                });
        }, function(err) {
            debug('getDevices populate error', err);
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
            if(!doc.firmware || !doc.firmware.data || doc.firmware.data.length === 0) {
                return res.sendStatus(404);
            }
            res.send(doc.firmware.data);
        }, function(err) {
            debug('downloadFirmware populate error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('downloadFirmware - end');
        });
};
