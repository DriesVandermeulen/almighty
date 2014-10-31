'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Profile = mongoose.model('Profile'),
    _ = require('lodash');

var STARTING_CREDITS_BEST = 5;
var STARTING_CREDITS_GOOD = 15;
var STARTING_CREDITS_BAD = 15;
var STARTING_CREDITS_WORST = 5;


var create = function(user, callback){

    var profile = new Profile();
    profile.credits.best = STARTING_CREDITS_BEST;
    profile.credits.good = STARTING_CREDITS_GOOD;
    profile.credits.bad = STARTING_CREDITS_BAD;
    profile.credits.worst = STARTING_CREDITS_WORST;
    profile.user = user;

    profile.save(function(err) {
        callback(err, profile);
    });
};

var update = function(profile, callback) {
    profile.save(function(err) {
        callback(err, profile);
    });
};

var remove = function(profile, callback) {

    profile.remove(function(err) {
        callback(err, profile);
    });
};

var getAll = function(callback){
    Profile
        .find()
        .exec(function(err, profiles) {
            callback(err, profiles);
        });
};

var getById = function(id, callback){
    Profile
        .findById(id)
        .exec(function(err, profile) {
            callback(err, profile);
        });
};

var getByUser = function(user, callback){
    Profile
        .findOne({user: user})
        .exec(function(err, profile) {
            callback(err, profile);
        });
};

var checkAuthorization = function(user, profile) {
    return (user.id !== profile.user.id);
};

var updateREST = function(req, res) {
    var profile = req.profile;

    profile = _.extend(profile, req.body);

    update(profile, function(err, profile) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(profile);
        }
    });
};

var readREST = function(req, res) {
    res.jsonp(req.profile);
};


var getByIdREST = function(req, res, next, id) {
    getById(id, function(err, profile) {
        if (err) {
            return next(err);
        }
        if (!profile) {
            return next(new Error('Failed to load subject ' + id));
        }
        req.rating = profile;
        next();
    });
};

var getByUserREST = function(req, res) {
    getByUser(req.user, function(err, profile) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(profile);
        }
    });
};

var checkAuthorizationREST = function(req, res, next) {
    if (checkAuthorization(req.user, req.profile)) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

module.exports = {
    REST:{
        update: updateREST,
        read: readREST,
        getById: getByIdREST,
        getByUser: getByUserREST,
        checkAuthorization: checkAuthorizationREST
    },
    create: create,
    update: update,
    remove: remove,
    getAll: getAll,
    getById: getById,
    getByUser: getByUser,
    checkAuthorization: checkAuthorization
};
