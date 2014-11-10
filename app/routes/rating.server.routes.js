'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    ratings = require('../../app/controllers/ratings.server.controller');

module.exports = function(app) {
    // Ratings Routes
    app.route('/ratings')
        .get(users.requiresLogin, ratings.REST.getAll)
        .post(users.requiresLogin, ratings.REST.create);

    app.route('/me/ratings')
        .get(users.requiresLogin, ratings.REST.getAllRatingsByUser);

    app.route('/ratings/:ratingId')
        .get(users.requiresLogin, ratings.REST.read)
        .put(users.requiresLogin, ratings.REST.checkAuthorization, ratings.REST.update)
        .delete(users.requiresLogin, ratings.REST.checkAuthorization, ratings.REST.remove);

    // Finish by binding the rating middleware
    app.param('ratingId', ratings.REST.getById);
};
