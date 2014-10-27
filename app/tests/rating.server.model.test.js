'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Rating = mongoose.model('Rating'),
    Subject = mongoose.model('Subject');

/**
 * Globals
 */
var user, subject, rating;

/**
 * Unit tests
 */
describe('Rating Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        subject = new Subject({
            name: 'Subject name',
            user: user
        });

        user.save(function() {
            subject.save(function() {
                rating = new Rating({
                    type: 'bad',
                    comment: 'This is a comment!',
                    subject: subject,
                    user: user
                });
                done();
            });
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return rating.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
        it('should be able to show an error when try to save rating with wrong type', function(done) {
            rating.type = 'test';

            return subject.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save rating without subject', function(done) {
            rating.user = '';

            return rating.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save rating with comment longer than 250 chars', function(done) {
            rating.comment = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
                'Nam gravida, felis quis accumsan efficitur, neque felis laoreet nisi, id molestie diam tellus ut sem. ' +
                'Vestibulum malesuada augue maximus, faucibus felis id, dapibus odio. Integer tincidunt at leo a cursus. ' +
                'Vestibulum laoreet ligula vitae magna blandit, vel efficitur metus sagittis. ' +
                'Integer malesuada dui rhoncus, semper orci sed, mollis sem. ' +
                'Nunc hendrerit accumsan nulla, et ullamcorper justo viverra eu.';

            return rating.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save rating without user', function(done) {
            rating.user = '';

            return rating.save(function(err) {
                should.exist(err);
                done();
            });
        });


    });

    afterEach(function(done) {
        Rating.remove().exec();
        Subject.remove().exec();
        User.remove().exec();
        done();
    });
});