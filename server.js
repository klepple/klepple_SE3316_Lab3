//server.js

// ----------------------- BASE SETUP ------------------------

// call the packages we need
var express = require('express');  // call express
var app = express();  // define our app using express
var bodyParser = require('body-parser');  // configure app to use bodyParser()

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dolphins', { useMongoClient: true}); // connect to our database

var Dolphin = require('./dolphin.js');

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ------------------ ROUTES FOR OUR API ---------------------

var router = express.Router();  // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// on routes that end in /dolphins
router.route('/dolphins')

    // create a dolphin (accessed at POST http://localhost:8080/api/dolphins)
    .post(function(req, res) {

        var dolphin = new Dolphin(); // create a new instance of the Dolphin model
        dolphin.name = req.body.name; // set the dolphins name (comes from the request)

        // save the dolphin and check for errors
        dolphin.save(function(err) {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Dolphin created!' });
        });

    })
    
    // get all the dolphins (accessed at GET http://localhost:8080/api/dolphins)
    .get(function(req, res) {
        Dolphin.find(function(err, dolphins) {
            if (err) {
                res.send(err);
            }

            res.json(dolphins);
        });
    });
    
// on routes that end in /dolphins/:dolphin_id
router.route('/dolphins/:dolphin_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/dolphins/:dolphin_id)
    .get(function(req, res) {
        Dolphin.findById(req.params.dolphin_id, function(err, dolphin) {
            if (err){
                res.send(err);
            }
            res.json(dolphin);
        });
    })
    
    // update the dolphin with this id (accessed at PUT http://localhost:8080/api/dolphins/:dolphin_id)
    .put(function(req, res) {

        // use our dolphin model to find the dolphin we want
        Dolphin.findById(req.params.dolphin_id, function(err, dolphin) {

            if (err){
                res.send(err);
            }

            dolphin.name = req.body.name;  // update the dolphin's info

            // save the dolphin
            dolphin.save(function(err) {
                if (err) {
                    res.send(err);
                }

                res.json({ message: 'Dolphin updated!' });
            });
        });
    })
        
    // delete the dolphin with this id (accessed at DELETE http://localhost:8080/api/dolphins/:dolphin_id)
    .delete(function(req, res) {
        Dolphin.remove({
            _id: req.params.dolphin_id
        }, function(err, dolphin) {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Successfully deleted' });
            
        });
    });

// -------------------------------- REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// ----------------------------- START THE SERVER ------------------------------------

app.listen(port);
console.log('Welcome! Magic happens on port ' + port);