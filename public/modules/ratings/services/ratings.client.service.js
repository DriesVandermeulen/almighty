'use strict';

//Ratings service used for communicating with the rating REST endpoints
angular.module('ratings').factory('Ratings', ['$resource',
    function($resource) {
        return $resource('ratings/:ratingId', {
            ratingId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);