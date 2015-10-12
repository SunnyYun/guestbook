'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * guestbook Schema
 */
var commentSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    guestbook:{
        type: Schema.ObjectId,
        ref: 'Gestbook'
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }

});

mongoose.model('Comment', commentSchema);
