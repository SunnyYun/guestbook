//fifth step
'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Comment = mongoose.model('Comment'),
    Guestbook = mongoose.model('Guestbook'),
    Schema = mongoose.Schema,
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a guestbook
 */
exports.create = function (req, res) {

    var guestbook = new Guestbook(req.body);
    guestbook.user = req.user;
    guestbook.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(guestbook);
        }
    });
};


exports.read = function (req, res) {

    var guestbookId = req.guestbook._id;
    Comment.find({guestbook:guestbookId}).sort('-created').populate('user', 'displayName').exec(function (err, commentts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var guestbookOne = {
                guestbook: req.guestbook,
                comments: commentts
            };
            res.json(guestbookOne);
        }
    });
};


exports.delete = function (req, res) {
    var guestbook = req.guestbook;

    guestbook.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(guestbook);
        }
    });
};

/**
 * List of guestbooks
 */
exports.list = function (req, res) {
    Guestbook.find().sort('-created').populate('user', 'displayName').exec(function (err, guestbooks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(guestbooks);
        }
    });
};

/**
 * guestbook middleware
 */
exports.guestbookByID = function (req, res, next, id) {
    Guestbook.findById(id).populate('user', 'displayName').exec(function (err, guestbook) {
        if (err) return next(err);
        if (!guestbook) return next(new Error('Failed to load guestbook ' + id));
        req.guestbook = guestbook;
        next();
    });
};


//exports.commentCreate = function (req, res) {
//    var guestQuery = {_id:req.body._id};
//    //var guestId = req.body._id;
//    var comment = req.body.comments;
//    comment.user = req.user;
//    Guestbook.findOneAndUpdate(guestQuery, {$push: {comments: comment}}, function (err,newGuestBook) {
//    //Guestbook.findOneAndUpdate(guestId, {$push: {comments: comment}}, function (err,newGuestBook) {
//        if (err) {
//            return res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            });
//        } else {
//            res.json(newGuestBook);
//        }
//    });
//};
//
//exports.commentList = function (req, res) {
//    Guestbook.find().sort('-created').populate('user', 'displayName').exec(function (err, guestbooks) {
//        if (err) {
//            return res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            });
//        } else {
//            res.json(guestbooks);
//        }
//    });
//};















