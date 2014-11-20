'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    subjects = require('../../app/controllers/subjects.server.controller');

module.exports = function(app) {
    // Subject Routes
    app.route('/subjects')
        .get(users.requiresLogin, subjects.REST.getAll)
        .post(users.requiresLogin, subjects.REST.create);

    app.route('/subjects/names')
        .get(users.requiresLogin, subjects.REST.getAllNames);

    app.route('/subjects/:subject')
        .get(users.requiresLogin, subjects.REST.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), subjects.REST.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), subjects.REST.remove);

    app.route('/subjects/:subject/ratings/count')
        .get(users.requiresLogin, subjects.REST.getRatingsCount);

    app.route('/subjects/:subject')
        .get(users.requiresLogin, subjects.REST.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), subjects.REST.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), subjects.REST.remove);

    app.param('subject', subjects.REST.get);
};