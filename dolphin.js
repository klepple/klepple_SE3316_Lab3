//dolphin.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DolphinSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Dolphin', DolphinSchema);