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

    app.route('/subjects/:subjectId')
        .get(users.requiresLogin, subjects.REST.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), subjects.REST.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), subjects.REST.delete);

    app.route('/subjects/:subjectName')
        .get(users.requiresLogin, subjects.REST.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), subjects.REST.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), subjects.REST.delete);

    // Finish by binding the subject middleware
    app.param('subjectId', subjects.REST.getById);
    app.param('subjectName', subjects.REST.getByName);
};