'use strict';

/**
 @module iccnu
 */
var config = require('./config/config');
var mongoose = require('./config/lib/mongoose');
var express = require('./config/lib/express');
//var nodejieba = require('nodejieba');

// Initialize mongoose
mongoose.connect(function (db) {

    //nodejieba.load();

    // Initialize express
    var app = express.init(db);

    // Start the app by listening on <port>
    app.listen(config.port);

    // Logging initialization
    console.log('MEAN.JS application started on port ' + config.port);
});
