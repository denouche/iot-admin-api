const publicCtrl = require('../controllers/publicCtrl');

module.exports = function (router) {
	
    router.route('/register')
        .post(publicCtrl.register);

    router.route('/download')
        .get(publicCtrl.download);

};
