

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  logger = require('./app/manage/log').dbLogger;


mongoose.Promise = global.Promise;//add this code from , if no collections add record will have error, https://github.com/Automattic/mongoose/issues/4291
mongoose.connect(config.db);
var db = mongoose.connection;

//connected
db.on('connected', function () {
  logger.info(' :connect to database at ' + config.db);
});


db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

//disconnected
db.on('disconnected', function () {
  logger.info(' :disconnect database at ' + config.db);
});

//load all mongo model
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

module.exports = require('./config/express')(app, config);

//listen port
app.listen(config.port, function () {
  console.log(config.startMessage, config.port);
});

