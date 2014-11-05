'use strict';

// Setting up route
angular.module('ratings').config(['$stateProvider',
    function($stateProvider) {
        // Ratings state routing
        $stateProvider.
            state('new-ratings', {
                url: '/ratings/new',
                templateUrl: 'modules/ratings/views/newRating.client.view.html'
            })
            .state('ratings', {
                url: '/ratings',
                templateUrl: 'modules/ratings/views/ratings.client.view.html'
            });
    }
]);