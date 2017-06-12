var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  CustomerSchema = mongoose.model('Customer'),
  moment = require('moment'),
  logger = require('../manage/log');

var config = require('../../config/config');

//*****************************************************************************************************************************************************
// router
module.exports = function (app) {
  app.use('/api/v1/customer', router);
};

//*****************************************************************************************************************************************************
router.use(function (req, res, next) {
  var logMessage = {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body
  }
  logger.info('/api/v1/customer Default Logger', logMessage);
  next();
});

//*****************************************************************************************************************************************************
//get customer info
// test pass
router.get('/', function (req, res, next) {
  try {
    var pagesize = req.query.pagesize || config.dataListSetting.default_pagesize;
    var pageindex = req.query.pageindex || config.dataListSetting.default_pageindex;

    var sortby = req.query.sortby;
    var order = req.query.order;

    //define query
    var query = CustomerSchema.find({});

    if (pagesize && pageindex) {
      query.limit(pagesize);
      query.skip((pageindex - 1) * pagesize);
    } else {
      query.limit(20);
      query.skip(0);
    }

    if (sortby) {
      query.sort({ sortby: -1 });
    }

    query.exec().then((customers) => {
      if (!customers) {
        throw new Error('Can Not Get Customer. Please Try Again.');
      } else {
        return res.status(200).json({ 'resultType': 'SUCCESS', 'results': [customers], 'resultMsg': '', 'exceptionDetail': null });
      }
    }).catch((err) => {
      logger.error(req.method + ' ' + req.originalUrl + ' Error', err);
      return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
    });
  }
  catch (err) {
    logger.error(req.method + ' ' + req.originalUrl + ' Error', err);
    return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
  }
});

//*****************************************************************************************************************************************************
//get customer info by id
router.get('/:id', function (req, res, next) {
  try {
    CustomerSchema.findOne({ _id: req.params.id }).then((customer) => {
      if (!customer) {
        throw new Error('Can Not Found Id [' + req.params.id + '] Customer. Please Try Again.');
      } else {
        return res.status(200).json({ 'resultType': 'SUCCESS', 'results': [customer], 'resultMsg': '', 'exceptionDetail': null });
      }
    }).catch((err) => {
      logger.error(req.method + ' ' + req.originalUrl + ' Error', err);
      return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
    })
  }
  catch (err) {
    logger.error(req.method + ' ' + req.originalUrl + ' Error', err);
    return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
  }
});

//*****************************************************************************************************************************************************
// create new customer
// test pass
router.post('/', function (req, res, next) {
  try {
    //we need check the parameter

    var customerEntity = new CustomerSchema({
      code: req.body.code,
      name: req.body.name,
      title: req.body.title,
      boss: req.body.boss,

      created: new Date(),
      updated: new Date()
    });

    customerEntity.save().then((newCustomer) => {
      if (!newCustomer) {
        throw new Error('Can Not Create Customer. Please Try Again.')
      } else {
        return res.status(200).json({ 'resultType': 'SUCCESS', 'results': [newCustomer], 'resultMsg': '', 'exceptionDetail': null });
      }
    }).catch((err) => {
      logger.error('error', req.method + ' ' + req.originalUrl + ' Error', err);
      return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
    });
  }
  catch (err) {
    logger.error('error', req.method + ' ' + req.originalUrl + ' Error', err);
    return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
  }
});

//*****************************************************************************************************************************************************
// update customer
// test pass
router.put('/:id', function (req, res, next) {
  try {
    //update query
    var query = {
      $set: {
        code: req.body.code,
        name: req.body.name,
        title: req.body.title,
        boss: req.body.boss,

        updated: new Date()
      }
    };

    //findOneAndUpdate need add { upsert: true, new: true } will return new entity
    CustomerSchema.findOneAndUpdate({ _id: req.params.id }, query, { upsert: true, new: true }).then((newcustomer) => {
      if (!newcustomer) {
        throw new Error('Can Not Found Id [' + req.params.id + '] Customer. Please Try Again.');
      } else {
        return res.status(200).json({ 'resultType': 'SUCCESS', 'results': [newcustomer], 'resultMsg': '', 'exceptionDetail': null });
      }
    }).catch((err) => {
      logger.error('error', req.method + ' ' + req.originalUrl + ' Error', err);
      return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
    });
  }
  catch (err) {
    logger.error('error', req.method + ' ' + req.originalUrl + ' Error', err);
    return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
  }
});

//*****************************************************************************************************************************************************
// delete customer
// test pass
router.delete('/:id', function (req, res, next) {
  try {
    CustomerSchema.findOneAndRemove({ _id: req.params.id }).then((customer) => {
      // if (!customer) {
      //   throw new Error('Can Not Found Id [' + req.params.id + '] Customer. Please Try Again.');
      // } else {
      //   //delete record
      //   customer.remove();
      return res.status(200).json({ 'resultType': 'SUCCESS', 'results': [], 'resultMsg': '', 'exceptionDetail': null });
      // }
    }).catch((err) => {
      logger.error('error', req.method + ' ' + req.originalUrl + ' Error', err);
      return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
    })
  }
  catch (err) {
    logger.error('error', req.method + ' ' + req.originalUrl + ' Error', err);
    return res.status(500).json({ 'resultType': 'ERROR', 'results': [], 'resultMsg': err.message, 'exceptionDetail': err.stack });
  }
});
