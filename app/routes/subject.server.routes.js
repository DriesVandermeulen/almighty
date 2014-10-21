'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    subjects = require('../../app/controllers/subjects.server.controller');

module.exports = function(app) {
    // Subject Routes
    app.route('/subjects')
        .get(users.requiresLogin, subjects.list)
        .post(users.requiresLogin, subjects.create);

    app.route('/subjects/:subjectId')
        .get(users.requiresLogin, subjects.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), subjects.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), subjects.delete);

    // Finish by binding the subject middleware
    app.param('subjectId', subjects.subjectByID);
};