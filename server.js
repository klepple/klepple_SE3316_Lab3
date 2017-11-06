//server.js

// ----------------------- BASE SETUP ------------------------

// call the packages we need
var express = require('express');  // call express
var app = express();  // define our app using express
var bodyParser = require('body-parser');  // configure app to use bodyParser()

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:28017/messageBoard', { useMongoClient: true}); // connect to our database

var Message = require('./message.js');

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8082; // set our port

// ------------------ ROUTES FOR OUR API ---------------------

var router = express.Router();  // get an instance of the express Router

// serve files in static' folder at root URL '/'
app.use('/', express.static('8082'));

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

// on routes that end in /messages
router.route('/messages')

    // create a message (accessed at POST http://localhost:8080/api/messages)
    .post(function(req, res) {

        var message = new Message(); // create a new instance of the Message model
        message.courseCode = req.body.courseCode; // set the courseCode
        message.content = req.body.content; //set the content
        message.timeStamp = req.body.timeStamp; //set the timeStamp
        
        //Set header to avoid CORS error
        res.setHeader("Access-Control-Allow-Origin", "*");
        
        // save the message and check for errors
        message.save(function(err) {
            if (err) {
                res.send(err);
            }
            console.log("message created!");
            res.json({ message: 'Message successfully created!' });
        });

    })
    
    // get all the messages (accessed at GET http://localhost:8081/api/messages)
    .get(function(req, res) {
         //Set header to avoid CORS error
        res.setHeader("Access-Control-Allow-Origin", "*");
        Message.find(function(err, messages) {
            if (err) {
                res.send(err);
            }
            console.log("got all messages");
            res.json(messages);
        });
    });
    
// on routes that end in /messages/:message_id
router.route('/messages/:message_id')

    // get the message with that id (accessed at GET http://localhost:8080/api/messages/:message_id)
    .get(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err){
                res.send(err);
            }
            res.json(message);
        });
    })
        
    // delete the message with this id (accessed at DELETE http://localhost:8080/api/messages/:message_id)
    .delete(function(req, res) {
        Message.remove({
            _id: req.params.message_id
        }, function(err, message) {
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