//message.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    courseCode: String,
    content: String,
    timeStamp: Date
});

module.exports = mongoose.model('Message', MessageSchema);