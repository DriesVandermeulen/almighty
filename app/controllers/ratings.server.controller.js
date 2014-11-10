'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Rating = mongoose.model('Rating'),
    Subject = mongoose.model('Subject'),
    Profile = mongoose.model('Profile'),
    async = require('async'),
    _ = require('lodash'),
    q = require('q');

var isCorrectType = function(type) {
    return _.contains(['worst', 'bad', 'good', 'best'], type);
};

var sendErrorResponse = function(res, err){
    return res.status(400).send({message: errorHandler.getErrorMessage(err)});
};

var createNewRating = function(type, comment, subject, user, callback) {
    Rating
        .findOne({user: user, subject: subject})
        .exec(function(err, profile) {
            if(err){
                callback(err, null);
            } else {
                if(!profile) {
                    Profile
                        .findOne({user: user})
                        .exec(function(err, profile) {
                            if(err){
                                callback(err, null);
                            } else {
                                if(profile) {
                                    if(isCorrectType(type)) {
                                        if(profile.credits[type] > 0){
                                            profile.credits[type]--;
                                            profile.save(function(err) {
                                                if(err) {
                                                    callback(err, null);
                                                } else {
                                                    var rating = new Rating();
                                                    rating.type = type;
                                                    rating.comment = comment;
                                                    rating.subject = subject;
                                                    rating.user = user;

                                                    rating.save(function(err, rating) {
                                                        callback(err, rating);
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(new Error('You have not enough credits'), null);
                                        }
                                    } else {
                                        callback(new Error('Unknown rating type'), null);
                                    }
                                } else {
                                    callback(new Error('Profile not found'), null);
                                }
                            }
                        });
                } else {
                    callback(new Error('You already judged this subject'), null);
                }
            }
        });
};

var createREST = function(req, res) {

    var subjectName = req.body.subjectName;
    var type = req.body.type;
    var comment = req.body.comment;
    var user = req.user;

    Subject
        .findOne({name: subjectName})
        .exec(function(err, subject) {
            if(err){
                return sendErrorResponse(res, err);
            }else{
                if(subject){
                    createNewRating(type, comment, subject, user, function(err, rating) {
                        if (err) {
                            return sendErrorResponse(res, err);
                        } else {
                            res.jsonp(rating);
                        }
                    });
                }else{
                    var newSubject = new Subject();
                    newSubject.name = subjectName;
                    newSubject.user = user;

                    newSubject.save(function(err, subject) {
                        if(err){
                            return sendErrorResponse(res, err);
                        }else{
                            createNewRating(type, comment, subject, user, function(err, rating) {
                                if (err) {
                                    newSubject.remove(function() {
                                        return sendErrorResponse(res, err);
                                    });
                                } else {
                                    res.jsonp(rating);
                                }
                            });
                        }
                    });
                }
            }
        });
};


var getRatingCountBySubjectAndType = function(subject, type, callback){
    Rating.count({subject: subject, type: type}, function(err, count) {
        callback(err, count);
    });
};

var getAllRatingsCountBySubject = function(subject, callback) {
    async
        .series([
            function(callback){
                getRatingCountBySubjectAndType(subject, 'worst', callback);
            },
            function(callback){
                getRatingCountBySubjectAndType(subject, 'bad', callback);
            },
            function(callback){
                getRatingCountBySubjectAndType(subject, 'good', callback);
            },
            function(callback){
                getRatingCountBySubjectAndType(subject, 'best', callback);
            }
        ],
        function(err, results){
            if (err) {
                callback(err, null);
            } else {
                callback(null, {
                    worst: results[0],
                    bad: results[1],
                    good: results[2],
                    best: results[3]
                });
            }
        });
};

var getAllRatingsByUserREST= function(req, res){

    var user = req.user;
    var type = req.param('type');

    var query = {user: user};
    if(type) query.type = type;

    Rating
        .find(query)
        .populate('user', 'username')
        .populate('subject', 'name')
        .exec(function(err, ratings) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(ratings);
            }
        });
};

var checkAuthorization = function(user, rating) {
    return (user.id !== rating.user.id);
};

var updateREST = function(req, res) {
    var rating = req.rating;

    rating = _.extend(rating, req.body);

    rating.save(function(err, rating) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(rating);
        }
    });
};

var removeREST = function(req, res) {
    var rating = req.rating;

    rating.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(rating);
        }
    });
};

var readREST = function(req, res) {
    res.jsonp(req.rating);
};

var getAllREST = function(req, res) {
    Rating
        .find()
        .populate('user', 'username')
        .exec(function(err, ratings) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(ratings);
            }
    });
};

var getCountBySubjectREST = function(req, res) {
    getAllRatingsCountBySubject(req.subject, function(err, ratingsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(ratingsCount);
            }
        });
};

var getByIdREST = function(req, res, next, id) {
    Rating
        .findById(id)
        .populate('user', 'username')
        .exec(function(err, rating) {
            if (err) {
                return next(err);
            }
            if (!rating) {
                return next(new Error('Failed to load subject ' + id));
            }
            req.rating = rating;
            next();
    });
};

var checkAuthorizationREST = function(req, res, next) {
    if (checkAuthorization(req.user, req.rating)) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

module.exports = {
    REST:{
        create: createREST,
        update: updateREST,
        remove: removeREST,
        read: readREST,
        getAll: getAllREST,
        getById: getByIdREST,
        checkAuthorization: checkAuthorizationREST,
        getCountBySubjectREST: getCountBySubjectREST,
        getAllRatingsByUser: getAllRatingsByUserREST,
    },
    createNewRating: createNewRating,
    checkAuthorization: checkAuthorization,
    getRatingCountBySubjectAndType: getRatingCountBySubjectAndType,
    getAllRatingsCountBySubject:  getAllRatingsCountBySubject
};
