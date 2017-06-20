const Device = require('../models/Device'),
    Version = require('../models/Version'),
    debug = require('debug')('iot-admin-api:downloadCtrl'),
    semver = require('semver');

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

module.exports.download = function(req, res) {
    debug('download - begin', req.query);
    let mac = req.query.mac;
    // Check plateform presence
    let device;
    Device.findOne({ mac: mac }).exec()
        .then(function(device) {
            if(!device) {
                res.status(404).json({message: `device with mac address ${mac} not found`});
                return Promise.reject();
            }
            if(!device._application) {
                res.status(409).json({message: `device with mac address ${mac} has no application associated with`});
                return Promise.reject();
            }
            if(!device._version) {
                res.status(409).json({message: `device with mac address ${mac} has no version associated with`});
                return Promise.reject();
            }
            return module.exports._populateDevice(device);
        }, function (err) {
            debug('download find error', err);
            res.status(500).send(err);
            return Promise.reject();
        })
        .then(function(devicePopulated) {
            device = devicePopulated;
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
                debug(`no last version found for device with mac address: ${mac}`);
                res.status(404).json({message: `no last version found for device with mac address: ${mac}`});
                return Promise.reject();
            }
            if(semver.lte(lastVersion[0].name, device._version.name)) {
                debug(`the device with mac address: ${mac} is already at the most recent version of firmware`);
                res.status(404).json({message: `the device with mac address: ${mac} is already at the most recent version of firmware`});
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
