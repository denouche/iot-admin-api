const downloadCtrl = require('../controllers/downloadCtrl');

module.exports = function (router) {

    router.route('/')
        .get(downloadCtrl.download);

};
