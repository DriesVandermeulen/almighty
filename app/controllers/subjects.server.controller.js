'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Subject = mongoose.model('Subject'),
    _ = require('lodash');


var createREST = function(req, res) {

    var name = req.body.name;
    var user = req.user;

    create(name, user, function(err, subject){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }else{
            res.jsonp(subject);
        }
    });
};

var updateREST = function(req, res) {
    var subject = req.subject;

    subject = _.extend(subject, req.body);

    update(subject, function(err, subject) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(subject);
        }
    });
};

var removeREST = function(req, res) {
    var subject = req.subject;

    remove(subject, function(err, subject) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(subject);
        }
    });
};

var readREST = function(req, res) {
    res.jsonp(req.subject);
};

var getAllREST = function(req, res) {
    getAll(function(err, subjects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(subjects);
        }
    });
};

var getByIdREST = function(req, res, next, id) {
    getById(id, function(err, subject) {
        if (err) {
            return next(err);
        }
        if (!subject) {
            return next(new Error('Failed to load subject ' + id));
        }
        req.subject = subject;
        next();
    });
};

var getByNameREST = function(req, res, next, name) {
    getByName(name, function(err, subject) {
        if (err) {
            return next(err);
        }
        if (!subject) {
            return next(new Error('Failed to load subject ' + id));
        }
        req.subject = subject;
        next();
    });
};

var checkAuthorizationREST = function(req, res, next) {
    if (checkAuthorization(req.user, req.subject)) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

var create = function(name, user, callback){

    var subject = new Subject();
    subject.name = name;
    subject.user = user;

    subject.save(function(err) {
        callback(err, subject)
    });
};

var update = function(subject, callback) {
    subject.save(function(err) {
        callback(err, subject);
    });
};

var remove = function(subject, callback) {

    subject.remove(function(err) {
        callback(err, subject)
    });
};

var getAll = function(callback){
    Subject
        .find()
        .exec(function(err, subjects) {
            callback(err, subjects)
        });
};

var getById = function(id, callback){
    Subject
        .findById(id)
        .exec(function(err, subject) {
            callback(err, subject)
        });
};

var getByName = function(name, callback){
    Subject
        .findOne({name: name}, '_id')
        .exec(function(err, subject) {
            callback(err, subject)
        });
};

var checkAuthorization = function(user, subject) {
    return (user.id !== subject.user.id);
};


module.exports = {
    REST:{
        create: createREST,
        update: updateREST,
        delete: removeREST,
        read: readREST,
        getAll: getAllREST,
        getById: getByIdREST,
        getByName: getByNameREST,
        checkAuthorization: checkAuthorizationREST
    },
    create: create,
    update: update,
    remove: remove,
    getAll: getAll,
    getById: getById,
    getByName: getByName,
    checkAuthorization: checkAuthorization
};