const versionsCtrl = require('../controllers/versionsCtrl'),
    Version = require('../models/Version'),
    multer = require('multer');

const upload = multer({ dest: '/tmp/iot-admin-api/firmwares/' });

module.exports = function (router) {
	
	router.route('/')
        .post(upload.single('firmware'), versionsCtrl.add);

    router.param('id', function(req, res, next, value) {
        Version.findOne({_id: req.params.id}, function (err, doc) {
            if(err) { return next(err); }
            else if (!doc) {
                return res.status(404).json({message: "Entity not found"});
            }
            req.version = doc;
            next();
        });
    });

    router.route('/:id')
        .get(versionsCtrl.get)
        .delete(versionsCtrl.remove)
        .put(upload.single('firmware'), versionsCtrl.modify);

    router.route('/:id/devices')
        .get(versionsCtrl.getDevices);

    router.route('/:id/download')
        .get(versionsCtrl.downloadFirmware);

};
