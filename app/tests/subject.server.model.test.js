'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Subject = mongoose.model('Subject');

/**
 * Globals
 */
var user, subject;

/**
 * Unit tests
 */
describe('Subject Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        user.save(function() {
            subject = new Subject({
                name: 'Subject name',
                user: user
            });

            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return subject.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
        it('should be able to show an error when try to save new subject with same name', function(done) {
            subject.save(function(err) {
                should.not.exist(err);

                var newSubject = new Subject({
                    name: 'Subject name',
                    user: user
                });

                return newSubject.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        it('should be able to show an error when try to save subject without name', function(done) {
            subject.name = '';

            return subject.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save subject with name shorter than 3 characters', function(done) {
            subject.name = '12';

            return subject.save(function(err) {
                should.exist(err);
                done();
            });
        });


        it('should be able to show an error when try to save subject without user', function(done) {
            subject.user = '';

            return subject.save(function(err) {
                should.exist(err);
                done();
            });
        });


    });

    afterEach(function(done) {
        Subject.remove().exec();
        User.remove().exec();
        done();
    });
});