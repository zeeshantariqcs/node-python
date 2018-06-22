var express = require('express');
var path = require('path');
var router = express.Router();
var config = require('../config'); //Config Include
var PythonShell = require('python-shell');


/* GET home page. */
router.get('/dashboard', function (req, res, next) {
    return res.render('index', {title: 'DASHBOARD', data: '', base_api_url: config.base_api_url});
});

/* GET home page. */
router.get('/', function (req, res, next) {
    return res.render('index', {title: 'DASHBOARD', data: '', base_api_url: config.base_api_url});
});


/* GET home page. */
router.get('/custom', function (req, res, next) {
    return res.render('custom', {title: 'DASHBOARD', 'data': ''});
});


router.post('/fetch-data', function (req, res, next) {
    if (typeof req.body.msisdn !== "undefined" && req.body.msisdn !== "") {
        var options = {
            mode: 'text',
            //pythonPath: 'C:\\Users\\Zeeshan\\AppData\\Roaming\\Python\\Python36',
            pythonOptions: ['-u'], // get print results in real-time
            //scriptPath: 'path/to/my/scripts',
            args: [req.body.msisdn]
        };
        //
        PythonShell.run(config.python_file, options, function (err, results) {
            if (err) {
                // return res.status(500).json(null);
                throw err;
            }
            // results is an array consisting of messages collected during execution
            console.log('results: %j', JSON.stringify(results));
            return res.json(results);
        });
    } else {
        return res.status(401).json(null);
    }
});


router.get('/download-file', function (req, res) {

    try {
        res.setHeader('Content-disposition', 'attachment; filename=traffic.txt');
        res.download(config.download_python_file_path); // Set disposition and send it.
    } catch (error) {
        console.log("Error occurred " + error);

        res.send(error);
    }

//     var filename_para = config.download_python_file_path; // abc.txt
//
//     if( filename_para == undefined)
//     {
//         console.log('no filename provided');
//         res.send('no filename provided');// this works
//         return;
//     }
//
//     var file = __dirname + '/uploads/' + filename_para;
//
//     var filename = path.basename(file);
// //    var mimetype = mime.lookup(file);
//
//     res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//     //res.setHeader('Content-type', mimetype);
//
//     var filestream = fs.createReadStream(file);
//
//     filestream.on('error', function(err) {
//         console.log('error '+err);
//         // filestream.close();
//         res.send(err);// this error is in abc.txt???
//
//     });
//
//     filestream.on('finish', function() {
//         console.log('finish');
//     });
//
//
//     filestream.pipe(res);
});


router.post('/capture-traffic', function (req, res, next) {
    if (typeof req.body.msisdn !== "undefined" && req.body.msisdn !== "") {
        var action = req.body.action || 0;
        var options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time
            args: [req.body.msisdn, action]
        };
        PythonShell.run(config.capture_python_file, options, function (err, results) {
            if (err) {
                // return res.status(500).json(null);
                throw err;
            }
            console.log('results: %j', JSON.stringify(results));
            return res.json(results);
        });
    } else {
        return res.status(401).json(null);
    }
});


// router.post('/fetch-data-dup', function (req, res, next) {
//     //Fetch data from python using child process
//     if (typeof req.body.msisdn !== "undefined" && req.body.msisdn !== "") {
//         var spawn = require("child_process").spawn;
//         var pythonProcess = spawn('python', [config.python_file, req.body.msisdn]);
//         pythonProcess.stdout.on('data', function (data) {
//             console.log("Received data is this " + data);
//             return res.json(data);
//         });
//     } else {
//         return res.status(401).json(null);
//     }
// });

module.exports = router;
