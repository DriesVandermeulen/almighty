'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    profiles = require('../../app/controllers/profiles.server.controller');

module.exports = function(app) {

    app.route('/profiles/:ratingId')
        .get(users.requiresLogin, profiles.REST.read)
        .put(users.requiresLogin, profiles.REST.checkAuthorization, profiles.REST.update);

    app.route('/users/me/profile')
        .get(users.requiresLogin, profiles.REST.getByUser);
    // Finish by binding the rating middleware
    app.param('ratingId', profiles.REST.getById);
};