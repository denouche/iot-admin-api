const devicesCtrl = require('../controllers/devicesCtrl'),
    Device = require('../models/Device');

module.exports = function (router) {
	
	router.route('/')
        .get(devicesCtrl.search)
        .post(devicesCtrl.add);

    router.param('id', function(req, res, next, value) {
        Device.findOne({_id: req.params.id}, function (err, doc) {
            if(err) { return next(err); }
            else if (!doc) { return next(new Error("Device not found")); }
            req.device = doc;
            next();
        });
    });

    router.route('/:id')
        .get(devicesCtrl.get)
        .put(devicesCtrl.modify);

};
