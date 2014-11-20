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

function HTTP400(res, err){
    return res.status(400).send({
        message: 'Something went wrong',
        error:  err.message
    });
}

function HTTP403(res, err){
    return res.status(403).send({
        message: 'You are not authorized',
        error: err.message
    });
}

function HTTP404(res, err){
    return res.status(404).send({
        message: 'Resource not found',
        error: err.message
    });
}

function HTTP200(res, body){
    return res.jsonp(body);
}

function ifSubjectFound(subject){
    if (!subject) throw new Error('Subject was not found');
    else return subject;
}


function extractNames(docs){
    var names = [];
    docs.forEach(function(subject) {
        names.push(subject.name);
    });
    return names;
}

function extractIds(docs){
    var ids = [];
    docs.forEach(function(subject) {
        ids.push(subject._id);
    });
    return ids;
}

function populateRatingCountQ(subject, type){
    return Rating.count({subject: subject, type: type}).execQ();
}

function populateRatingsQ(subject){
    return Rating
        .find({subject: subject}).populate('user', 'username').execQ()
        .then(function(ratings){
            subject._doc.ratings = ratings;
            return subject;
        });
}

function populateRatingsIdQ(subject){
    return Rating
        .find({subject: subject}).execQ()
        .then(function(ratings){
            subject._doc.ratings = extractIds(ratings);
            return subject;
        });
}

function populateRatingsCountQ(subject) {
    var count = {};
    return populateRatingCountQ(subject, 'worst')
        .then(function (value) {
            count.worst = value;
            return populateRatingCountQ(subject, 'bad');
        })
        .then(function (value) {
            count.bad = value;
            return populateRatingCountQ(subject, 'good');
        })
        .then(function (value) {
            count.good = value;
            return populateRatingCountQ(subject, 'best');
        })
        .then(function (value) {
            count.best = value;
            subject._doc.ratings = count;
            return subject;
        });
}

function populateRatings(subjects, populationType) {
    switch(populationType){
        case 'full': {
            return Q.all(subjects.map(populateRatingsQ));
        }
        case 'id': {
            return Q.all(subjects.map(populateRatingsIdQ));
        }
        case 'count': {
            return Q.all(subjects.map(populateRatingsCountQ));
        }
        default:{
            return subjects;
        }
    }
}

function checkAuthorization(user, subject) {
    return user.id !== subject.user.id;
}

var createREST = function(req, res) {
    var subject = new Subject();
    subject.name = req.body.name;
    subject.user = req.user;
    subject
        .saveQ()
        .then(function(subject){
            return HTTP200(res, subject);
        })
        .catch(function(err){
            return HTTP400(res, err);
        })
        .done();
};

var updateREST = function(req, res) {
    var subject = _.extend(req.subject, req.body);
    subject
        .saveQ()
        .then(function(subject){
            return HTTP200(res, subject);
        })
        .catch(function(err){
            return HTTP400(res, err);
        })
        .done();
};

var removeREST = function(req, res) {
    var subject = req.subject;
    subject
        .removeQ()
        .then(function(subject){
            return HTTP200(res, subject);
        })
        .catch(function(err){
            return HTTP400(res, err);
        })
        .done();
};

var readREST = function(req, res) {
    return HTTP200(res, req.subject);
};

var getREST = function(req, res, next, name) {
    Subject
        .findOne({name: name}).execQ()
        .then(ifSubjectFound)
        .then(populateRatingsQ)
        .then(function(subject){
            req.subject = subject;
            next();
        })
        .catch(function(err){
            return HTTP404(res, err);
        })
        .done();
};

var getRatingsCountREST = function(req, res) {
    populateRatingsCountQ(req.subject)
        .then(function(count){
            return HTTP200(res, count);
        })
        .catch(function(err){
            return HTTP400(res, err);
        })
        .done();
};

var getAllREST = function(req, res) {
    var ratingsPopulationType = req.param('ratingsPopulationType');

    Subject
        .find().execQ()
        .then(function(subjects){
            return populateRatings(subjects, ratingsPopulationType);
        })
        .then(function(subjects){
            return HTTP200(res, subjects);
        })
        .catch(function(err){
            return HTTP400(res, err);
        })
        .done();
};

var getAllNamesREST = function(req, res){
    var search = req.param('search');
    var query = {};

    if(search && search.length >= 3){
        query.name = new RegExp('[a-z0-9]*'+search+'*[a-z0-9]', 'i');
    }

    Subject
        .find(query).execQ()
        .then(function(subjects){
            return HTTP200(res, extractNames(subjects));
        })
        .catch(function(err){
            return HTTP400(res, err);
        })
        .done();
};

var checkAuthorizationREST = function(req, res, next) {
    if (checkAuthorization(req.user, req.subject)) {
        return HTTP403(res, null);
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
        getRatingsCount: getRatingsCountREST,
        get: getREST,
        checkAuthorization: checkAuthorizationREST,
        getAllNames: getAllNamesREST
    }
};