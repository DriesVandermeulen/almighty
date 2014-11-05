'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Rating = mongoose.model('Rating'),
    async = require('async'),
    _ = require('lodash');

var create = function(type, comment, subject, user, callback){

    var rating = new Rating();
    rating.type = type;
    rating.comment = comment;
    rating.subject = subject;
    rating.user = user;

    rating.save(function(err) {
        callback(err, rating);
    });
};

var update = function(rating, callback) {
    rating.save(function(err) {
        callback(err, rating);
    });
};

var remove = function(rating, callback) {

    rating.remove(function(err) {
        callback(err, rating);
    });
};

var getAll = function(callback){
    Rating
        .find()
        .populate('user', 'username')
        .exec(function(err, ratings) {
            callback(err, ratings);
        });
};

var getById = function(id, callback){
    Rating
        .findById(id)
        .populate('user', 'username')
        .exec(function(err, ratings) {
            callback(err, ratings);
        });
};


var getRatingCountBySubjectAndType = function(subject, type, callback){
    Rating
        .count({subject: subject, type: type}, function(err, count) {
            callback(err, count);
        });
};

var getAllRatingsCountBySubject = function(subject, callback) {
    async.series([
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


var checkAuthorization = function(user, rating) {
    return (user.id !== rating.user.id);
};

var createREST = function(req, res) {
    var type = req.body.type;
    var comment = req.body.comment;
    var subject = req.body.subject;
    var user = req.user;

    create(type, comment, subject, user, function(err, rating) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(rating);
        }
    });
};

var updateREST = function(req, res) {
    var rating = req.rating;

    rating = _.extend(rating, req.body);

    update(rating, function(err, rating) {
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

    remove(rating, function(err, rating) {
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
    getAll(function(err, ratings) {
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
    getById(id, function(err, rating) {
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
        getCountBySubjectREST: getCountBySubjectREST
    },
    create: create,
    update: update,
    remove: remove,
    getAll: getAll,
    getById: getById,
    checkAuthorization: checkAuthorization,
    getRatingCountBySubjectAndType: getRatingCountBySubjectAndType,
    getAllRatingsCountBySubject:  getAllRatingsCountBySubject
};
