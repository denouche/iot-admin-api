const applicationsCtrl = require('../controllers/applicationsCtrl'),
    Application = require('../models/Application');

module.exports = function (router) {
	
	router.route('/')
        .get(applicationsCtrl.list)
        .post(applicationsCtrl.add);

    router.param('id', function(req, res, next, value) {
        Application.findOne({_id: req.params.id}, function (err, doc) {
            if(err) { return next(err); }
            else if (!doc) {
                return res.status(404).json({message: "Entity not found"});
            }
            req.application = doc;
            next();
        });
    });

    router.route('/:id')
        .get(applicationsCtrl.get)
        .delete(applicationsCtrl.remove)
        .put(applicationsCtrl.modify);

    router.route('/:id/devices')
        .get(applicationsCtrl.getDevices);

    router.route('/:id/versions')
        .get(applicationsCtrl.getVersions);

};
