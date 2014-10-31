'use strict';

//Ratings service used for communicating with the rating REST endpoints
angular.module('ratings').factory('Api', ['$resource',
    function($resource) {

        return {
            Ratings: $resource('ratings/:ratingId', {ratingId: '@_id'}, {update: {method: 'PUT'}}),
            Subjects:  $resource('subjects/:subjectId', {subjectId: '@_id'},{update: {method: 'PUT'}}),
            Profiles:  $resource('profiles/:profileId', {profileId: '@_id'},{update: {method: 'PUT'}})
        };
    }
]);