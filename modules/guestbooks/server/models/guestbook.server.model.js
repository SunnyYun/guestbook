'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * guestbook Schema
 */
var guestbookSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    //title: {
    //	type: String,
    //	default: '',
    //	trim: true,
    //	required: 'Theme cannot be blank'
    //},
    //depth: {
    //	type: Number
    //},
    //comments: [{
    //	user:{
    //		type: Schema.ObjectId,
    //		ref: 'User'
    //	},
    //	content:{
    //		type: String,
    //		default: '',
    //		trim: true
    //	},
    //	created:{
    //		type: Date,
    //		default: Date.now
    //	}
    //}],
    //comments: [{
    //    type: Schema.ObjectId,
    //    ref: 'Comment'
    //}],
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

mongoose.model('Guestbook', guestbookSchema);
