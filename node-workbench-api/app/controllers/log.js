var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    fs = require('fs'),
    readline = require('readline');;

module.exports = function (app) {
    app.use('/api/v1/log', router);
};

router.get('/', function (req, res, next) {
    try {
        var logDate = req.query.logdate;
        var logType = req.query.logtype;

        if (!logDate) {
            throw new Error('log date is null or empty , can not found log file');
        }

        if (!logType) {
            throw new Error('log type is null or empty , can not found log file');
        }

        var filename = logDate + '.log';
        var logDirectory = './log/' + logType + '/';
        if (!fs.existsSync(logDirectory)) {
            throw new Error('no log file');
        } else if (!fs.existsSync(logDirectory + filename)) {
            throw new Error('can not found log file[' + filename + ']');
        }


        var lineReader = readline.createInterface({
            input: fs.createReadStream(logDirectory + filename)
        });

        var logs = []

        lineReader.on('line', (line) => {
            // console.log('Line from file:', line);
            logs.push(line);
        });

        lineReader.on('close'), function () {

            console.log(logs);
            // res.render('log', {
            //     logs: data
            // });
        };

        // fs.readFile(logDirectory + filename, 'utf-8', function (err, data) {
        //     if (err) {
        //         throw err;
        //     }
        //     else {
        //     }
        // });
    }
    catch (err) {
        res.render('error', {
            message: err.message,
            error: err
        });
    }
});

