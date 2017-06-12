// winston = require('winston'),
//     moment = require('moment'),
//     fs = require('fs');

// var logDirectory = './log/';
// var infologDirectory = './log/info/';
// var errorlogDirectory = './log/error/';
// if (!fs.existsSync(infologDirectory)) {
//     fs.mkdirSync(infologDirectory);
// }
// if (!fs.existsSync(errorlogDirectory)) {
//     fs.mkdirSync(errorlogDirectory);
// }

// const tsFormat = () => (new Date()).toLocaleTimeString()


// const logger = new (winston.Logger)({
//     levels: {
//         info: 0,
//         warn: 1,
//         error: 2,
//         verbose: 3,
//         i: 4,
//         db: 5
//     },
//     colors: {
//         debug: 'blue',
//         info: 'green',
//         warn: 'yellow',
//         error: 'red'
//     },
//     transports: [
//         new (winston.transports.File)({
//             name: 'info-file',
//             timestamp: tsFormat,
//             datePattern: 'yyyy-MM-dd',
//             filename: infologDirectory + moment().format('YYYY-MM-DD') + '.log',
//             level: 'info',
//             json: true
//         }),
//         new (winston.transports.File)({
//             name: 'error-file',
//             timestamp: tsFormat,
//             datePattern: 'yyyy-MM-dd',
//             filename: errorlogDirectory + moment().format('YYYY-MM-DD') + '.log',
//             level: 'error',
//             json: true
//         }),
//         // new (winston.transports.Console)({
//         //     name: 'error-file',
//         //     timestamp: tsFormat,
//         //     datePattern: 'yyyy-MM-dd',
//         //     level: 'debug',
//         //     json: true,
//         //     colorize: true
//         // })
//     ]
// });

// module.exports = logger;



'use strict';

const fs = require('fs');
const winston = require('winston');
const moment = require('moment');
const stackTrace = require('stack-trace');
// const _ = require('underscore');
const DailyRotateFile = require('winston-daily-rotate-file');

const dateFormat = function () {
    return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};

var logDirectory = './log/';
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// var infologDirectory = './log/info/';
// var errorlogDirectory = './log/error/';
// if (!fs.existsSync(infologDirectory)) {
//     fs.mkdirSync(infologDirectory);
// }
// if (!fs.existsSync(errorlogDirectory)) {
//     fs.mkdirSync(errorlogDirectory);
// }


// 开发阶段使用的logger
let logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
            timestamp: dateFormat,
            colorize: true
        })
    ]
});

logger.dbLogger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
            timestamp: dateFormat,
            colorize: true
        })
    ]
});

// 如果有／log目录，说明在docker环境下，创建基于文件的logger
if (fs.existsSync(logDirectory)) {

    //all log file
    const allLoggerTransport = new DailyRotateFile({
        name: 'all',
        filename: logDirectory + 'all.log',
        timestamp: dateFormat,
        level: 'info',
        colorize: true,
        maxsize: 1024 * 1024 * 10,
        datePattern: '.yyyy-MM-dd'
    });

    //error log file
    const errorTransport = new (winston.transports.File)({
        name: 'error',
        filename: logDirectory + 'error.log',
        timestamp: dateFormat,
        level: 'error',
        colorize: true
    });

    //define logger
    logger = new (winston.Logger)({
        transports: [
            allLoggerTransport,
            errorTransport
        ]
    });

    // 崩溃日志
    const crashLogger = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                name: 'error',
                filename: logDirectory + 'crash.log',
                level: 'error',
                handleExceptions: true,
                timestamp: dateFormat,
                humanReadableUnhandledException: true,
                json: false,
                colorize: true
            })
        ]
    });

    // 数据库日志
    const dbLoggerTransport = new (winston.transports.File)({
        name: 'db',
        filename: logDirectory + 'db.log',
        timestamp: dateFormat,
        level: 'info'
    });
    //db log file
    logger.dbLogger = new (winston.Logger)({
        transports: [dbLoggerTransport]
    });

    logger.dbLogger.add(allLoggerTransport, {}, true);
    logger.dbLogger.add(errorTransport, {}, true);
}


// 代理logger.error方法，加入文件路径和行号信息
let originalMethod = logger.error;
logger.error = function () {
    let cellSite = stackTrace.get()[1];
    originalMethod.apply(logger, [arguments[0] + '\n', { filePath: cellSite.getFileName(), lineNumber: cellSite.getLineNumber() }]);
}

module.exports = logger;

