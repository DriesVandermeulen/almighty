'use strict';

angular.module('ratings').controller('RatingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ratings',
    function($scope, $stateParams, $location, Authentication, Ratings) {
        $scope.authentication = Authentication;

        $scope.create = function() {
            var rating = new Ratings({
                title: this.title,
                content: this.content
            });
            rating.$save(function(response) {
                $location.path('ratings/' + response._id);

                $scope.title = '';
                $scope.content = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(rating) {
            if (rating) {
                rating.$remove();

                for (var i in $scope.ratings) {
                    if ($scope.ratings[i] === rating) {
                        $scope.ratings.splice(i, 1);
                    }
                }
            } else {
                $scope.rating.$remove(function() {
                    $location.path('ratings');
                });
            }
        };

        $scope.update = function() {
            var rating = $scope.rating;

            rating.$update(function() {
                $location.path('ratings/' + rating._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function() {
            $scope.ratings = Ratings.query();
        };

        $scope.findOne = function() {
            $scope.rating = Ratings.get({
                ratingId: $stateParams.ratingId
            });
        };
    }
]);