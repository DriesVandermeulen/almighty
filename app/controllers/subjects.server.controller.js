'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    errorHandler = require('./errors.server.controller'),
    Subject = mongoose.model('Subject'),
    Rating = mongoose.model('Rating'),
    async = require('async'),
    _ = require('lodash'),
    Q = require('q');

function returnHTTP400(err, res){
    return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
    });
}

function returnHTTP403(res){
    return res.status(403).send({
        message: 'You are not authorized'
    });
}

function returnHTTP404(res){
    return res.status(404).send({
        message: 'Resource not found'
    });
}

var createREST = function(req, res) {
    var subject = new Subject();
    subject.name = req.body.name;
    subject.user = req.user;
    subject
        .saveQ()
        .then(function(subject){
            res.jsonp(subject);
        })
        .catch(function(err){
            returnHTTP400(err, res);
        })
        .done();
};

var updateREST = function(req, res) {
    var subject = _.extend(req.subject, req.body);
    subject
        .saveQ()
        .then(function(subject){
            res.jsonp(subject);
        })
        .catch(function(err){
            returnHTTP400(err, res);
        })
        .done();
};

var removeREST = function(req, res) {
    var subject = req.subject;
    subject
        .removeQ()
        .then(function(subject){
            res.jsonp(subject);
        })
        .catch(function(err){
            returnHTTP400(err, res);
        })
        .done();
};

var readREST = function(req, res) {
    res.jsonp(req.subject);
};

var getRatingCount = function(subject, type){
    return Rating.count({subject: subject, type: type}).execQ();
};

var getAllRatingsCount = function(subject) {
    var count = {};
    return getRatingCount(subject, 'worst')
        .then(function(value){
            count.worst = value;
            return getRatingCount(subject, 'bad');
        })
        .then(function(value){
            count.bad = value;
            return getRatingCount(subject, 'good');
        })
        .then(function(value){
            count.good = value;
            return getRatingCount(subject, 'best');
        })
        .then(function(value){
            count.best = value;
            return count;
        })
        .catch(function(err){
            throw err;
        });
};

var getAllREST = function(req, res) {
    Subject
        .find().execQ()
        .then(function(subjects){
            async.each(subjects, function(subject, callback){
                getAllRatingsCount(subject)
                    .then(function(count){
                        subject._doc.ratings = count;
                        callback(null, subject);
                    })
                    .catch(function(err){
                        returnHTTP400(err);
                    })
                    .done();
            }, function(err){
                if (err) returnHTTP400(err);
                else res.jsonp(subjects);
            });
        })
        .catch(function(err){
            returnHTTP400(err);
        });
};

var isSubjectFound = function(subject){
    return Q.fcall(function() {
        if (!subject) throw new Error('Failed to load subject');
        else return subject;
    });
};

var getREST = function(req, res, next, name) {
    Subject
        .findOne({name: name}).execQ()
        .then(isSubjectFound)
        .then(function(subject){
            req.subject = subject;
            next();
        })
        .catch(function(){
            returnHTTP404(res);
        })
        .done();
};

function checkAuthorization(user, subject) {
    return user.id !== subject.user.id;
}

var checkAuthorizationREST = function(req, res, next) {
    if (checkAuthorization(req.user, req.subject)) {
        returnHTTP403(res);
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
        get: getREST,
        checkAuthorization: checkAuthorizationREST
    }
};