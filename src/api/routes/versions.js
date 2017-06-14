const versionsCtrl = require('../controllers/versionsCtrl'),
    Version = require('../models/Version');

module.exports = function (router) {
	
	router.route('/')
        .post(versionsCtrl.add);

    router.param('id', function(req, res, next, value) {
        Version.findOne({_id: req.params.id}, function (err, doc) {
            if(err) { return next(err); }
            else if (!doc) { return next(new Error("Version not found")); }
            req.version = doc;
            next();
        });
    });

    router.route('/:id')
        .get(versionsCtrl.get)
        .put(versionsCtrl.modify);

    router.route('/:id/devices')
        .get(versionsCtrl.getDevices);

};
