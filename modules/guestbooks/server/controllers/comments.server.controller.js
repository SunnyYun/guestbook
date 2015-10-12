/**
 * Created by Flyiyi on 2015/9/29.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Comment = mongoose.model('Comment'),
    Guestbook = mongoose.model('Guestbook'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


//exports.list = function (req, res) {
//    console.log('@@@@@');
//    Comment.find({_id:guestbookId}).sort('-created').populate('user', 'displayName').exec(function (err, comments) {
//        if (err) {
//            return res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            });
//        } else {
//            res.json(comments);
//        }
//    });
//};
//
////exports.commentCreate = function (req, res) {
////    console.log('--------------------------------------------req.body--------------------' + req.body);
////    var comment = req.body.comments;
////    comment.user = req.user;
////
////    Guestbook.findOneAndUpdate(guestQuery, {$push: {comments: comment}}, function (err, newGuestBook) {
////        //Guestbook.findOneAndUpdate(guestId, {$push: {comments: comment}}, function (err,newGuestBook) {
////        if (err) {
////            return res.status(400).send({
////                message: errorHandler.getErrorMessage(err)
////            });
////        } else {
////            res.json(newGuestBook);
////        }
////    });
////};
exports.create = function (req, res) {

    var comment = new Comment();
    comment.content = req.body.content;
    comment.guestbook = req.body.guestbook;
    comment.user = req.user;
    comment.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(comment);
        }
    });
};


exports.commentByID = function (req, res, next, id) {
    Comment.findById(id).populate('user', 'displayName').exec(function (err, comment) {
        if (err) return next(err);
        if (!comment) return next(new Error('Failed to load guestbook ' + id));
        req.comment = comment;
        next();
    });
};
