'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    profiles = require('../../app/controllers/profiles.server.controller');

module.exports = function(app) {

    app.route('/users/me/profile')
        .get(users.requiresLogin, profiles.REST.getByUser);

};