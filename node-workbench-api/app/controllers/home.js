var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/api/v1/', router);
};

router.get('/', function (req, res, next) {

  try {
    // throw new Error('ssssss');

    var userinfo = {
      title: "weschen",
      age: 16,
      mail: 'chenxuhua0530@163.com'
    }
    
    return res.status(200).json({ 'resultType': 'SUCCESS', 'results': [userinfo], 'resultMsg': '', 'exceptionDetail': null });
  }
  catch (err) {
    return res.status(200).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err });
  }

});

