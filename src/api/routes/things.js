const thingsCtrl = require('../controllers/thingsCtrl'),
    Thing = require('../models/Thing');

module.exports = function (router) {
	
	router.route('/')
        .get(thingsCtrl.list)
        .post(thingsCtrl.add);

    router.param('id', function(req, res, next, value) {
        Thing.findOne({_id: req.params.id}, function (err, doc) {
            if(err) { return next(err); }
            else if (!doc) { return next(new Error("Thing not found")); }
            req.thing = doc;
            next();
        });
    });

    router.route('/:id')
        .get(thingsCtrl.get)
        .put(thingsCtrl.modify);

    router.route('/:id/devices')
        .get(thingsCtrl.getDevices);

};