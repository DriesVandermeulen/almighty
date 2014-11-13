'use strict';

//Ratings service used for communicating with the rating REST endpoints
angular.module('ratings').factory('Api', ['$resource',
    function($resource) {

        return {
            Ratings: $resource('ratings/:ratingId', {ratingId: '@_id'}, {update: {method: 'PUT'}}),
            Subjects:  $resource('subjects/:subject', {subject: '@name'},{update: {method: 'PUT'}})
        };
    }
]);