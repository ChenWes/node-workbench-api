var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development',
  defaultPort = process.env.PORT || 3000,
  appName = 'Workbench',
  appStartMessage = 'Workbench server listening on port \'%s\' ';

//get data list setting
var getDataSetting = {
  default_pagesize: 20,
  default_pageindex: 1,
  // sortby: null,
  // order: null
}

var config = {
  development: {
    root: rootPath,
    app: {
      name: appName
    },
    port: defaultPort,
    db: 'mongodb://192.168.99.100/workbench-dev',
    startMessage: appStartMessage,

    dataListSetting: getDataSetting
  },

  test: {
    root: rootPath,
    app: {
      name: appName
    },
    port: defaultPort,
    db: 'mongodb://192.168.99.100/workbench-test',
    startMessage: appStartMessage,

    dataListSetting: getDataSetting
  },

  production: {
    root: rootPath,
    app: {
      name: appName
    },
    port: defaultPort,
    db: 'mongodb://192.168.99.100/workbench',
    startMessage: appStartMessage,

    dataListSetting: getDataSetting
  }
};

module.exports = config[env];
