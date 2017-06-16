const Application = require('../models/Application'),
    Device = require('../models/Device'),
    Version = require('../models/Version'),
	debug = require('debug')('iot-admin-api:publicCtrl'),
    fs = require('fs');

module.exports._populateDevice = function(doc) {
    return doc
        .populate('_application')
        .populate('_version')
        .execPopulate();
};
module.exports._populateVersion = function(doc) {
    return doc
        .populate('_application')
        .execPopulate();
};

module.exports.register = function(req, res) {
    debug('register - begin');

    let update = {
        mac: req.body.mac,
        ssid: req.body.ssid,
        ip: req.body.ip,
        last_register: Date.now()
    };

    Application.findOne({ name: req.body.application }).exec()
        .then(function(doc) {
            if(!doc) {
                debug(`register find application error, unknown application [${req.body.application}]`);
                return Promise.reject();
            }
            update._application = doc._id;
            return Version.findOne({ name: req.body.version, _application: doc._id }).exec();
        }, function (err) {
            debug('register find application error', err);
            return Promise.reject();
        })
        .then(function(doc) {
            if(!doc) {
                debug(`register find version error, unknown version [${req.body.version}]`);
                return;
            }
            update._version = doc._id;
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

module.exports.download = function(req, res) {
    debug('download - begin', req.query);
    let mac = req.query.mac;
    // Check plateform presence
    Device.findOne({ mac: mac }).exec()
        .then(function(device) {
            if(!device) {
                res.status(404).json({message: `device with mac address ${mac} not found`});
                return Promise.reject();
            }
            return module.exports._populateDevice(device);
        }, function (err) {
            debug('download find error', err);
            res.status(500).send(err);
            return Promise.reject();
        })
        .then(function(devicePopulated) {
            return Version.find({ _application: devicePopulated._application._id, plateform: devicePopulated.plateform})
                .sort({ created_at : -1 })
                .limit(1)
                .exec();
        }, function(err) {
            debug('download populate device error', err);
            return Promise.reject();
        })
        .then(function(lastVersion) {
            if(!lastVersion || lastVersion.length === 0) {
                res.status(404).json({message: `no last version found for application ${devicePopulated._application._id} and plateform ${devicePopulated.plateform}`});
                return Promise.reject();
            }
            return module.exports._populateVersion(lastVersion[0]);
        }, function(err) {
            debug('download populate version error', err);
            return Promise.reject();
        })
        .then(function(lastVersionPopulated) {
            res.attachment(lastVersionPopulated._application.name + '_' + lastVersionPopulated.name + '.' + lastVersionPopulated.plateform + '.bin');
            if(!lastVersionPopulated.firmware || !lastVersionPopulated.firmware.data || lastVersionPopulated.firmware.data.length === 0) {
                return res.status(404).send({memssage: `No firmware found for version ${lastVersionPopulated.name}`});
            }
            res.send(lastVersionPopulated.firmware.data);
        }, function(err) {
            debug('download populate error', err);
            res.status(500).send(err);
        })
        .then(function() {
            debug('download - end');
        });
};
