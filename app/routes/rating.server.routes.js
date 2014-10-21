'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    ratings = require('../../app/controllers/ratings.server.controller');

module.exports = function(app) {
    // Ratings Routes
    app.route('/ratings')
        .get(users.requiresLogin, ratings.list)
        .post(users.requiresLogin, ratings.create);

    app.route('/ratings/:ratingId')
        .get(users.requiresLogin, ratings.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), ratings.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), ratings.delete);

    // Finish by binding the rating middleware
    app.param('ratingId', ratings.ratingByID);
};
