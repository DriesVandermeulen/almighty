'use strict';

// Setting up route
angular.module('ratings').config(['$stateProvider',
    function($stateProvider) {
        // Ratings state routing
        $stateProvider
            .state('me-ratings', {
                url: '/me/ratings',
                templateUrl: 'modules/ratings/views/me-ratings.client.view.html'
            })
            .state('ratings', {
                url: '/ratings',
                templateUrl: 'modules/ratings/views/ratings.client.view.html'
            })
            .state('ratings-new', {
                url: '/ratings/new',
                templateUrl: 'modules/ratings/views/ratings-new.client.view.html'
            });

    }
]);