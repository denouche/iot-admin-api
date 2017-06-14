const thingsCtrl = require('../controllers/thingsCtrl'),
    Thing = require('../models/Thing');

module.exports = function (router) {
	
	router.route('/')
        .get(thingsCtrl.list)
        .post(thingsCtrl.add);

    router.param('id', function(req, res, next, value) {
        Thing.findOne({_id: req.params.id}, function (err, doc) {
            if(err) { return next(err); }
            else if (!doc) {
                return res.status(404).json({message: "Entity not found"});
            }
            req.thing = doc;
            next();
        });
    });

    router.route('/:id')
        .get(thingsCtrl.get)
        .delete(thingsCtrl.remove)
        .put(thingsCtrl.modify);

    router.route('/:id/devices')
        .get(thingsCtrl.getDevices);

};